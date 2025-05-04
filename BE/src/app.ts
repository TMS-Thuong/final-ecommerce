import cors from '@fastify/cors';
import { swagger, prismaPlugin, errorHandler, fastifyJwt, zodPlugin } from '@plugins/index';
import AuthController from '@services/auth.service';
import fastify from 'fastify';

import { authUserRoutes } from './routes/auth.routes';

declare module 'fastify' {
  interface FastifyInstance {
    verifyEmailToken: (token: string) => Promise<{ success: boolean; message: string }>;
  }
}

const app = fastify({ logger: true });

app.addHook('onSend', async (request, reply) => {
  reply.header('Cross-Origin-Opener-Policy', 'unsafe-none');
  reply.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
});

app.register(cors, {
  origin: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Cross-Origin-Opener-Policy'],
  credentials: true,
});

app.register(prismaPlugin);
app.register(errorHandler);
app.register(fastifyJwt);
app.register(zodPlugin);

swagger(app);

app.decorate('verifyEmailToken', AuthController.verifyEmailToken);

app.get('/', async () => {
  return { message: 'Fastify Blog API is running' };
});
app.register(authUserRoutes, { prefix: '/api' });

export default app;
