import { FastifyInstance } from 'fastify';

import paymentController from '@app/controllers/payment.controller';
import { verifyUserAuthentication } from '@app/middlewares/auth.middleware';
import { paymentMethodSchema, createPaymentUrlSchema, paymentStatusSchema } from '@app/schemas/payment.schema';

export async function paymentRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', verifyUserAuthentication);

    protectedRoutes.get('/payment/methods', {
      schema: paymentMethodSchema,
      handler: paymentController.getPaymentMethods.bind(paymentController),
    });

    protectedRoutes.get('/payment/status/:orderId', {
      schema: paymentStatusSchema,
      handler: paymentController.getPaymentStatus.bind(paymentController),
    });

    protectedRoutes.get('/payment/create-url/:orderId', {
      schema: createPaymentUrlSchema,
      handler: paymentController.createPaymentUrl.bind(paymentController),
    });
  });
}
