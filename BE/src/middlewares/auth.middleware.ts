import { FastifyReply, FastifyRequest } from 'fastify';

export const verifyUserAuthentication = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.unauthorized('Authentication required', 'UNAUTHORIZED');
  }
};

export const optionalUserAuthentication = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    await req.jwtVerify();
  } catch (err) {
    req.user = null;
  }
};
