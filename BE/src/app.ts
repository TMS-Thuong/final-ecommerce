import cors from '@fastify/cors';
import fastify from 'fastify';

import AuthController from '@app/services/auth-user.service';
import { swagger, prismaPlugin, errorHandler, fastifyJwt, zodPlugin } from '@plugins/index';
import multipartPlugin from '@plugins/multipart.plugin';
import staticPlugin from '@plugins/static.plugin';

import { addressRoutes } from './routes/address.routes';
import { authUserRoutes } from './routes/auth-user.routes';
import { brandRoutes } from './routes/brand.routes';
import { cartRoutes } from './routes/cart.routes';
import { categoryRoutes } from './routes/category.routes';
import { favoriteRoutes } from './routes/favorite.routes';
import { orderRoutes } from './routes/order.routes';
import { paymentRoutes } from './routes/payment.routes';
import { productRoutes } from './routes/product.routes';
import publicPaymentRoutes from './routes/public-payment.routes';
import shippingRoutes from './routes/shipping.routes';
import userRoutes from './routes/user.route';

declare module 'fastify' {
  interface FastifyInstance {
    verifyToken: (token: string) => Promise<{ success: boolean; message: string }>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { email: string; userId: number };
    user: { email: string; userId: number };
  }
}

const app = fastify({ logger: true });

app.addHook('onSend', async (request, reply) => {
  reply.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  reply.header('Cross-Origin-Embedder-Policy', 'require-corp');
});

app.register(cors, {
  origin: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Cross-Origin-Opener-Policy', 'Cross-Origin-Embedder-Policy'],
  credentials: true,
});

app.register(prismaPlugin);
app.register(errorHandler);
app.register(fastifyJwt);
app.register(zodPlugin);
app.register(multipartPlugin);
app.register(staticPlugin);

swagger(app);

app.decorate('verifyToken', AuthController.verifyToken);

app.get('/', async () => {
  return { message: 'Fastify Blog API is running' };
});

app.register(authUserRoutes, { prefix: '/user/api' });
app.register(addressRoutes, { prefix: '/user/api' });
app.register(shippingRoutes, { prefix: '/api' });
app.register(orderRoutes, { prefix: '/api' });
app.register(paymentRoutes, { prefix: '/api' });
app.register(productRoutes, { prefix: '/api' });
app.register(categoryRoutes, { prefix: '/api' });
app.register(brandRoutes, { prefix: '/api' });
app.register(cartRoutes, { prefix: '/api' });
app.register(favoriteRoutes, { prefix: '/api' });
app.register(publicPaymentRoutes);
app.register(userRoutes);

export default app;
