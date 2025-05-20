import { FastifyReply, FastifyRequest } from 'fastify';

import { AddressZodSchema, AddressIdZodSchema } from '@app/schemas/address.zod';
import AddressService from '@app/services/address.service';
import { binding } from '@decorator/binding';

class AddressController {
  @binding
  async getUserAddresses(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user.userId;
      const addresses = await AddressService.getUserAddresses(userId);

      const addressArray = Array.isArray(addresses) ? addresses : [];

      return reply.send({
        success: true,
        data: addressArray,
      });
    } catch (error) {
      console.error('Error getting user addresses:', error);
      return reply.internalError();
    }
  }

  @binding
  async createAddress(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const result = AddressZodSchema.safeParse(request.body);
      if (!result.success) {
        return reply.badRequest(result.error.errors[0]?.message || 'Invalid address data', 'INVALID_ADDRESS_DATA');
      }

      const userId = request.user.userId;
      const address = await AddressService.createAddress(userId, result.data);
      return reply.created({ data: address });
    } catch (error) {
      console.error('Error creating address:', error);
      return reply.internalError();
    }
  }

  @binding
  async updateAddress(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const idResult = AddressIdZodSchema.safeParse({ id: parseInt(request.params.id) });
      if (!idResult.success) {
        return reply.badRequest('Invalid address ID', 'INVALID_ADDRESS_ID');
      }

      const result = AddressZodSchema.partial().safeParse(request.body);
      if (!result.success) {
        return reply.badRequest(result.error.errors[0]?.message || 'Invalid address data', 'INVALID_ADDRESS_DATA');
      }

      const userId = request.user.userId;
      const address = await AddressService.updateAddress(idResult.data.id, userId, result.data);
      return reply.ok({ data: address });
    } catch (error) {
      console.error('Error updating address:', error);
      if (error instanceof Error && error.message === 'Address not found') {
        return reply.notFound('Address not found', 'ADDRESS_NOT_FOUND');
      }
      return reply.internalError();
    }
  }

  @binding
  async deleteAddress(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const idResult = AddressIdZodSchema.safeParse({ id: parseInt(request.params.id) });
      if (!idResult.success) {
        return reply.badRequest('Invalid address ID', 'INVALID_ADDRESS_ID');
      }

      const userId = request.user.userId;
      await AddressService.deleteAddress(idResult.data.id, userId);
      return reply.ok({ message: 'Address deleted successfully' });
    } catch (error) {
      console.error('Error deleting address:', error);
      if (error instanceof Error && error.message === 'Address not found') {
        return reply.notFound('Address not found', 'ADDRESS_NOT_FOUND');
      }
      return reply.internalError();
    }
  }

  @binding
  async getAddressById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const idResult = AddressIdZodSchema.safeParse({ id: parseInt(request.params.id) });
      if (!idResult.success) {
        return reply.badRequest('Invalid address ID', 'INVALID_ADDRESS_ID');
      }

      const userId = request.user.userId;
      const address = await AddressService.getAddressById(idResult.data.id, userId);

      return reply.send({
        success: true,
        data: address,
      });
    } catch (error) {
      console.error('Error getting address by ID:', error);
      if (error instanceof Error && error.message === 'Address not found') {
        return reply.notFound('Address not found', 'ADDRESS_NOT_FOUND');
      }
      return reply.internalError();
    }
  }
}

export default new AddressController();
