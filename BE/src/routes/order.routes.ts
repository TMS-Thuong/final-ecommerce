import { FastifyInstance } from 'fastify';

import orderController from '@app/controllers/order.controller';
import { verifyUserAuthentication } from '@app/middlewares/auth.middleware';
import {
  createOrderSchema,
  getOrderDetailsSchema,
  getUserOrdersSchema,
  getOrderByCodeSchema,
  cancelOrderSchema,
} from '@app/schemas/order.schema';

export async function orderRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', verifyUserAuthentication);

  fastify.post('/orders', {
    schema: createOrderSchema,
    handler: orderController.createOrder.bind(orderController),
  });

  fastify.get('/orders', {
    schema: getUserOrdersSchema,
    handler: orderController.getUserOrders.bind(orderController),
  });

  fastify.get('/orders/by-code/:code', {
    schema: getOrderByCodeSchema,
    handler: orderController.getOrderByCode.bind(orderController),
  });

  fastify.get('/orders/:id', {
    schema: getOrderDetailsSchema,
    handler: orderController.getOrderDetails.bind(orderController),
  });

  fastify.post('/orders/:id/cancel', {
    schema: cancelOrderSchema,
    handler: orderController.cancelOrder.bind(orderController),
  });
}
