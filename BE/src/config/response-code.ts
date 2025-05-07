import { FastifyInstance, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

import { AuthErrorMessages } from '@app/config/auth.message';

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorateReply('badRequest', function (this: FastifyReply, message: string, code: string) {
    return this.status(400).send({ error: true, code, message });
  });

  fastify.decorateReply('unauthorized', function (this: FastifyReply, message: string, code: string) {
    return this.status(401).send({ error: true, code, message });
  });

  fastify.decorateReply('forbidden', function (this: FastifyReply, message: string, code: string) {
    return this.status(403).send({ error: true, code, message });
  });

  fastify.decorateReply('notFound', function (this: FastifyReply, message: string, code: string) {
    return this.status(404).send({ error: true, code, message });
  });

  fastify.decorateReply('conflict', function (this: FastifyReply, message: string, code: string) {
    return this.status(409).send({ error: true, code, message });
  });

  fastify.decorateReply(
    'internalError',
    function (this: FastifyReply, message = AuthErrorMessages.SERVER_ERROR, code = 'SERVER_ERROR') {
      return this.status(500).send({ error: true, code, message });
    }
  );

  fastify.decorateReply('ok', function (this: FastifyReply, data?: unknown) {
    return this.status(200).send({ success: true, data });
  });

  fastify.decorateReply('created', function (this: FastifyReply, data: unknown) {
    return this.status(201).send({ success: true, data });
  });
});

declare module 'fastify' {
  interface FastifyReply {
    badRequest(message: string, code: string): FastifyReply;
    unauthorized(message: string, code: string): FastifyReply;
    forbidden(message: string, code: string): FastifyReply;
    notFound(message: string, code: string): FastifyReply;
    conflict(message: string, code: string): FastifyReply;
    internalError(message?: string, code?: string): FastifyReply;
    ok<T = unknown>(data?: T): FastifyReply;
    created<T = unknown>(data: T): FastifyReply;
  }
}
