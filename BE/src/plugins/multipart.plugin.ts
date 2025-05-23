import multipart from '@fastify/multipart';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  await fastify.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: 1,
    },
  });
});
