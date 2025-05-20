import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import ShippingService from '@app/services/shipping.service';
import { binding } from '@decorator/binding';

const CalculateShippingFeeSchema = z.object({
  shippingMethodId: z.number().int().positive(),
  totalAmount: z.number().min(0),
});

class ShippingController {
  @binding
  async getShippingMethods(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const methods = await ShippingService.getShippingMethods();

      const methodsArray = Array.isArray(methods) ? methods : [];

      return reply.send({
        success: true,
        data: methodsArray,
      });
    } catch (error) {
      console.error('Error getting shipping methods:', error);
      return reply.internalError();
    }
  }

  @binding
  async calculateShippingFee(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const result = CalculateShippingFeeSchema.safeParse(request.body);
      if (!result.success) {
        return reply.badRequest(result.error.errors[0]?.message || 'Invalid data', 'INVALID_SHIPPING_DATA');
      }

      const { shippingMethodId, totalAmount } = result.data;
      const fee = await ShippingService.calculateShippingFee(shippingMethodId, totalAmount);

      return reply.send({
        success: true,
        data: { fee },
      });
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      if (error instanceof Error && error.message === 'Shipping method not found') {
        return reply.notFound('Shipping method not found', 'SHIPPING_METHOD_NOT_FOUND');
      }
      return reply.internalError();
    }
  }
}

export default new ShippingController();
