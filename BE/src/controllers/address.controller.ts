import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorCode } from '@app/constants/error.constants';
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

      return reply.ok(addressArray);
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
        return reply.badRequest(
          result.error.errors[0]?.message || 'Invalid address data',
          ErrorCode.INVALID_ADDRESS_DATA
        );
      }

      const userId = request.user.userId;
      const address = await AddressService.createAddress(userId, result.data);
      return reply.created(address);
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
        return reply.badRequest('Invalid address ID', ErrorCode.INVALID_ADDRESS_ID);
      }

      const result = AddressZodSchema.partial().safeParse(request.body);
      if (!result.success) {
        return reply.badRequest(
          result.error.errors[0]?.message || 'Invalid address data',
          ErrorCode.INVALID_ADDRESS_DATA
        );
      }

      const userId = request.user.userId;
      try {
        const address = await AddressService.updateAddress(idResult.data.id, userId, result.data);
        return reply.ok(address);
      } catch (serviceError) {
        if (serviceError instanceof Error && serviceError.message === 'Address not found') {
          return reply.notFound('Address not found', ErrorCode.ADDRESS_NOT_FOUND);
        }
        throw serviceError;
      }
    } catch (error) {
      console.error('Error updating address:', error);
      return reply.internalError();
    }
  }

  @binding
  async deleteAddress(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const idResult = AddressIdZodSchema.safeParse({ id: parseInt(request.params.id) });
      if (!idResult.success) {
        return reply.badRequest('Invalid address ID', ErrorCode.INVALID_ADDRESS_ID);
      }

      const userId = request.user.userId;
      try {
        await AddressService.deleteAddress(idResult.data.id, userId);
        return reply.ok({ message: 'Address deleted successfully' });
      } catch (serviceError) {
        if (serviceError instanceof Error && serviceError.message === 'Address not found') {
          return reply.notFound('Address not found', ErrorCode.ADDRESS_NOT_FOUND);
        }
        throw serviceError;
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      return reply.internalError();
    }
  }

  @binding
  async getAddressById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const idResult = AddressIdZodSchema.safeParse({ id: parseInt(request.params.id) });
      if (!idResult.success) {
        return reply.badRequest('Invalid address ID', ErrorCode.INVALID_ADDRESS_ID);
      }

      const userId = request.user.userId;
      try {
        const address = await AddressService.getAddressById(idResult.data.id, userId);
        return reply.ok(address);
      } catch (serviceError) {
        if (serviceError instanceof Error && serviceError.message === 'Address not found') {
          return reply.notFound('Address not found', ErrorCode.ADDRESS_NOT_FOUND);
        }
        throw serviceError;
      }
    } catch (error) {
      console.error('Error getting address by ID:', error);
      return reply.internalError();
    }
  }
}

export default new AddressController();
