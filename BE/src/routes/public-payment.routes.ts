import { FastifyInstance } from 'fastify';

import PaymentController from '@app/controllers/payment.controller';
import { VNPayReturnSchema, VNPayIpnSchema } from '@app/schemas/payment.schema';

export default async function publicPaymentRoutes(app: FastifyInstance): Promise<void> {
  app.get('/payment/vnpay_return', { schema: VNPayReturnSchema }, PaymentController.VNPayReturn);
  app.get('/payment/vnpay_ipn', { schema: VNPayIpnSchema }, PaymentController.VNPayIpn);
}
