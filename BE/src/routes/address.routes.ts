import { FastifyInstance } from 'fastify';

import addressController from '@app/controllers/address.controller';
import { verifyUserAuthentication } from '@app/middlewares/auth.middleware';
import {
  createAddressSchema,
  deleteAddressSchema,
  getAddressByIdSchema,
  getUserAddressesSchema,
  updateAddressSchema,
} from '@app/schemas/address.schema';

export async function addressRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', verifyUserAuthentication);

  fastify.get('/addresses', {
    schema: getUserAddressesSchema,
    handler: addressController.getUserAddresses.bind(addressController),
  });

  fastify.get('/addresses/:id', {
    schema: getAddressByIdSchema,
    handler: addressController.getAddressById.bind(addressController),
  });

  fastify.post('/addresses', {
    schema: createAddressSchema,
    handler: addressController.createAddress.bind(addressController),
  });

  fastify.put('/addresses/:id', {
    schema: updateAddressSchema,
    handler: addressController.updateAddress.bind(addressController),
  });

  fastify.delete('/addresses/:id', {
    schema: deleteAddressSchema,
    handler: addressController.deleteAddress.bind(addressController),
  });
}
