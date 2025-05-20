import { FastifyInstance } from 'fastify';

import ShippingController from '@app/controllers/shipping.controller';
import { verifyUserAuthentication } from '@app/middlewares/auth.middleware';
import { calculateShippingFeeSchema, getShippingMethodsSchema } from '@app/schemas/shipping.schema';

export default async function shippingRoutes(app: FastifyInstance): Promise<void> {
  app.get('/shipping/methods', { schema: getShippingMethodsSchema }, ShippingController.getShippingMethods);

  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', verifyUserAuthentication);

    protectedRoutes.post(
      '/shipping/calculate-fee',
      { schema: calculateShippingFeeSchema },
      ShippingController.calculateShippingFee
    );
  });
}
