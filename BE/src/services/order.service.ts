import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';

import { CreateOrderZodSchema } from '@app/schemas/order.zod';
import ShippingService from '@app/services/shipping.service';

import VNPayService from './vnpay.service';

const prisma = new PrismaClient();

class OrderService {
  private generateOrderCode(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORD${timestamp}${random}`;
  }

  private async ensurePaymentMethods(): Promise<void> {
    const count = await prisma.paymentMethod.count();
    if (count === 0) {
      await prisma.paymentMethod.createMany({
        data: [
          { name: 'VNPay', code: 'vnpay', description: 'Payment via VNPay' },
          { name: 'Cash on Delivery', code: 'cod', description: 'Pay on delivery' },
        ],
      });
    }
  }

  async createOrder(
    userId: number,
    orderData: typeof CreateOrderZodSchema._type
  ): Promise<{ order: unknown; paymentUrl?: string }> {
    await this.ensurePaymentMethods();

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Kiểm tra xem sản phẩm có đủ số lượng trong kho không
    for (const item of cart.items) {
      if (item.quantity > item.product.stockQuantity) {
        throw new Error(
          `Không đủ số lượng sản phẩm "${item.product.name}" trong kho. Chỉ còn ${item.product.stockQuantity} sản phẩm.`
        );
      }
    }

    const address = await prisma.address.findFirst({
      where: {
        id: orderData.addressId,
        userId,
      },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    const shippingMethod = await prisma.shippingMethod.findUnique({
      where: { id: orderData.shippingMethodId },
    });

    if (!shippingMethod) {
      throw new Error('Shipping method not found');
    }

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: orderData.paymentMethodId },
    });

    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    const couponDiscount = 0;
    // if (orderData.couponCode) {
    // Logic to apply coupon discount
    // }

    const subtotal = cart.items.reduce((total, item) => {
      const price = item.product.salePrice || item.product.basePrice;
      return total + Number(price) * item.quantity;
    }, 0);

    const shippingFee = await ShippingService.calculateShippingFee(orderData.shippingMethodId, subtotal);
    const discountAmount = couponDiscount;
    const totalAmount = subtotal + shippingFee - discountAmount;

    let order;

    await prisma.$transaction(async (tx) => {
      // Tạo đơn hàng mới trong hệ thống
      order = await tx.order.create({
        data: {
          orderCode: this.generateOrderCode(),
          userId,
          addressId: orderData.addressId,
          paymentId: orderData.paymentMethodId,
          shippingId: orderData.shippingMethodId,
          subtotal,
          shippingFee,
          discountAmount,
          couponCode: orderData.couponCode,
          totalAmount,
          status: OrderStatus.Pending,
          paymentStatus: PaymentStatus.Pending,
          customerNotes: orderData.customerNotes,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              quantity: item.quantity,
              price: item.product.salePrice || item.product.basePrice,
              subtotal: Number(item.product.salePrice || item.product.basePrice) * item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Cập nhật số lượng sản phẩm trong kho sau khi đặt hàng
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Xóa giỏ hàng sau khi đặt hàng thành công
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    });

    // Tạo URL VNPay
    let paymentUrl: string | undefined = undefined;

    if (paymentMethod.code === 'vnpay' && order) {
      paymentUrl = await VNPayService.createPaymentUrl(order.id);
    }

    return { order, paymentUrl };
  }

  async getOrderDetails(orderId: number, userId: number): Promise<unknown> {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: { include: { product: true } },
        paymentMethod: true,
        shippingMethod: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async getUserOrders(userId: number): Promise<unknown> {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        address: true,
        paymentMethod: true,
        shippingMethod: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelOrder(orderId: number, userId: number): Promise<{ success: boolean; message?: string; order?: unknown }> {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return {
        success: false,
        message: 'Order not found',
      };
    }

    if (order.status !== OrderStatus.Pending && order.status !== OrderStatus.Processing) {
      return {
        success: false,
        message: 'Order cannot be cancelled at this stage.',
      };
    }

    try {
      const updatedOrder = await prisma.$transaction(async (tx) => {
        const updated = await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.Cancelled,
            paymentStatus: order.paymentStatus === PaymentStatus.Paid ? PaymentStatus.Refunded : PaymentStatus.Failed,
          },
          include: {
            items: { include: { product: true } },
            address: true,
            paymentMethod: true,
            shippingMethod: true,
          },
        });

        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                increment: item.quantity,
              },
            },
          });
        }

        return updated;
      });

      return {
        success: true,
        order: updatedOrder,
      };
    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        message: 'An error occurred while cancelling the order',
      };
    }
  }

  async getOrderByCode(code: string, userId: string): Promise<unknown> {
    return prisma.order.findFirst({
      where: {
        orderCode: code,
        userId: !isNaN(parseInt(userId)) ? parseInt(userId) : undefined,
      },
      include: {
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}

export default new OrderService();
