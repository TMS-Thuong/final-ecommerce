import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

import { CreateOrderZodSchema, OrderIdZodSchema } from '@app/schemas/order.zod';
import OrderService from '@app/services/order.service';
import { binding } from '@decorator/binding';

class OrderController {
  @binding
  async createOrder(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user.userId;
      const result = CreateOrderZodSchema.safeParse(request.body);

      if (!result.success) {
        return reply.badRequest(result.error.errors[0]?.message || 'Invalid order data', 'INVALID_ORDER_DATA');
      }

      const orderData = result.data;
      const { order, paymentUrl } = await OrderService.createOrder(userId, orderData);

      return reply.send({
        success: true,
        data: { order, paymentUrl },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Address not found')) {
          return reply.notFound('Address not found', 'ADDRESS_NOT_FOUND');
        } else if (error.message.includes('Shipping method not found')) {
          return reply.notFound('Shipping method not found', 'SHIPPING_METHOD_NOT_FOUND');
        } else if (error.message.includes('Payment method not found')) {
          return reply.notFound('Payment method not found', 'PAYMENT_METHOD_NOT_FOUND');
        } else if (error.message.includes('Cart is empty')) {
          return reply.badRequest('Cart is empty', 'EMPTY_CART');
        }
      }

      console.error('Error creating order:', error);
      return reply.internalError();
    }
  }

  @binding
  async getUserOrders(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user.userId;
      const orders = await OrderService.getUserOrders(userId);

      return reply.send({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error('Error getting user orders:', error);
      return reply.internalError();
    }
  }

  @binding
  async getOrderDetails(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user.userId;
      const result = OrderIdZodSchema.safeParse(request.params);

      if (!result.success) {
        return reply.badRequest(result.error.errors[0]?.message || 'Invalid order ID', 'INVALID_ORDER_ID');
      }

      const { id } = result.data;
      const order = await OrderService.getOrderDetails(id, userId);

      if (!order) {
        return reply.notFound('Order not found', 'ORDER_NOT_FOUND');
      }

      return reply.send({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error('Error getting order details:', error);
      return reply.internalError();
    }
  }

  @binding
  async getOrderByCode(request: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { code } = request.params;
      const userId = request.user.userId;

      const order = await OrderService.getOrderByCode(code, userId.toString());

      if (!order) {
        return reply.notFound('Order not found', 'ORDER_NOT_FOUND');
      }

      return reply.send({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error('Error retrieving order by code:', error);
      return reply.internalError();
    }
  }

  @binding
  async cancelOrder(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user.userId;
      const paramsResult = OrderIdZodSchema.safeParse(request.params);

      if (!paramsResult.success) {
        return reply.badRequest(paramsResult.error.errors[0]?.message || 'Invalid order ID', 'INVALID_ORDER_ID');
      }

      const { id } = paramsResult.data;
      const cancelResult = await OrderService.cancelOrder(id, userId);

      if (cancelResult.success) {
        return reply.send({
          success: true,
          message: 'Order cancelled successfully',
          data: cancelResult.order,
        });
      } else {
        return reply.badRequest(cancelResult.message, 'CANNOT_CANCEL_ORDER');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      return reply.internalError();
    }
  }
}

export default new OrderController();
