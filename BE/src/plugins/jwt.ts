import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';

import { JWT_SECRET } from '@app/config';
import 'fastify';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      email: string;
      userId: number;
    };
    user: {
      email: string;
      userId: number;
    };
  }
}

export default fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: JWT_SECRET,
    sign: {
      expiresIn: '2h',
    },
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.unauthorized('Invalid token or authentication required', 'UNAUTHORIZED');
    }
  });
});
