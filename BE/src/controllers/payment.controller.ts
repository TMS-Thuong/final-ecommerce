import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

import { CLIENT_URL, ORDER_COMPLETE } from '@app/config/env';
import { ErrorCode } from '@app/constants/error.constants';
import { VNPayResponseCode } from '@app/constants/vnpay.constants';
import VNPayService from '@app/services/vnpay.service';
import { binding } from '@decorator/binding';

const prisma = new PrismaClient();

class PaymentController {
  @binding
  async VNPayReturn(
    request: FastifyRequest<{ Querystring: { [key: string]: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      console.log('VNPay return callback:', request.query);
      const result = await VNPayService.verifyReturnUrl(request.query);

      console.log('VNPay verification result:', result);

      if (!result.isValid) {
        console.error('Invalid VNPay signature:', request.query);
        return reply.status(400).send({
          success: false,
          message: 'Invalid signature',
        });
      }

      const order = await prisma.order.findUnique({
        where: { id: result.orderId },
        select: {
          id: true,
          orderCode: true,
          totalAmount: true,
        },
      });

      if (!order) {
        console.error('Order not found:', result.orderId);
        return reply.status(404).send({
          success: false,
          message: 'Order not found',
        });
      }

      if (result.responseCode === VNPayResponseCode.SUCCESS) {
        // Thanh toán thành công, cập nhật trạng thái đơn hàng
        await prisma.order.update({
          where: { id: result.orderId },
          data: {
            status: OrderStatus.Processing,
            paymentStatus: PaymentStatus.Paid,
          },
        });

        return reply.redirect(`${ORDER_COMPLETE}/${order.id}`);
      } else if (result.responseCode === VNPayResponseCode.CUSTOMER_CANCEL) {
        await prisma.order.update({
          where: { id: result.orderId },
          data: {
            paymentStatus: PaymentStatus.Failed,
          },
        });

        return reply.redirect(`${ORDER_COMPLETE}/${order.id}?status=cancelled`);
      } else {
        await prisma.order.update({
          where: { id: result.orderId },
          data: {
            paymentStatus: PaymentStatus.Failed,
          },
        });

        return reply.redirect(`${ORDER_COMPLETE}/${order.id}?status=failed`);
      }
    } catch (error) {
      console.error('Error processing VNPay callback:', error);
      return reply.redirect(CLIENT_URL);
    }
  }

  @binding
  async VNPayIpn(
    request: FastifyRequest<{ Querystring: { [key: string]: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      console.log('VNPay IPN callback received:', request.query);

      const result = await VNPayService.processIpnCallback(request.query);

      if (!result || typeof result.RspCode !== 'string' || typeof result.Message !== 'string') {
        return reply.status(200).send({ RspCode: '99', Message: 'Invalid response format' });
      }

      return reply.status(200).send(result);
    } catch (error) {
      console.error('Error processing VNPay IPN:', error);
      return reply.status(200).send({ RspCode: '99', Message: 'Internal server error' });
    }
  }

  @binding
  async createPaymentUrl(request: FastifyRequest<{ Params: { orderId: string } }>, reply: FastifyReply): Promise<void> {
    try {
      // Tạo URL thanh toán VNPAY cho đơn hàng
      const orderId = parseInt(request.params.orderId, 10);

      if (isNaN(orderId)) {
        return reply.badRequest('Invalid order ID', ErrorCode.INVALID_ORDER_ID);
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return reply.notFound('Order not found', ErrorCode.ORDER_NOT_FOUND);
      }

      const paymentUrl = await VNPayService.createPaymentUrl(orderId);

      if (!paymentUrl) {
        return reply.status(500).send({ message: 'Failed to create payment URL' });
      }

      return reply.send({
        success: true,
        paymentUrl,
      });
    } catch (error) {
      console.error('Error creating payment URL:', error);
      return reply.internalError();
    }
  }

  @binding
  async getPaymentMethods(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const count = await prisma.paymentMethod.count();

      if (count === 0) {
        await prisma.paymentMethod.createMany({
          data: [
            { name: 'VNPay', code: 'vnpay', description: 'Payment via VNPay' },
            { name: 'Cash on Delivery', code: 'cod', description: 'Pay when you receive the package' },
          ],
        });
      }

      const paymentMethods = await prisma.paymentMethod.findMany();

      const methodsArray = Array.isArray(paymentMethods) ? paymentMethods : [];

      return reply.send({
        success: true,
        data: methodsArray,
      });
    } catch (error) {
      console.error('Error getting payment methods:', error);
      return reply.internalError();
    }
  }

  @binding
  async getPaymentStatus(request: FastifyRequest<{ Params: { orderId: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const orderId = parseInt(request.params.orderId);

      if (isNaN(orderId)) {
        return reply.badRequest('Invalid order ID', ErrorCode.INVALID_ORDER_ID);
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          orderCode: true,
          status: true,
          paymentStatus: true,
          totalAmount: true,
        },
      });

      if (!order) {
        return reply.notFound('Order not found', ErrorCode.ORDER_NOT_FOUND);
      }

      return reply.ok({
        success: true,
        data: {
          orderId: order.id,
          orderCode: order.orderCode,
          status: order.status,
          paymentStatus: order.paymentStatus,
        },
      });
    } catch (error) {
      console.error('Error getting payment status:', error);
      return reply.internalError();
    }
  }
}

export default new PaymentController();
