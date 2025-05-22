import { PrismaClient, Address } from '@prisma/client';

import { AddressZodSchema } from '@app/validations/address.zod';

const prisma = new PrismaClient();

class AddressService {
  async getUserAddresses(userId: number): Promise<Array<Address>> {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAddress(userId: number, addressData: typeof AddressZodSchema._type): Promise<Address> {
    if (addressData.isDefaultShipping) {
      await prisma.address.updateMany({
        where: { userId, isDefaultShipping: true },
        data: { isDefaultShipping: false },
      });
    }

    if (addressData.isDefaultBilling) {
      await prisma.address.updateMany({
        where: { userId, isDefaultBilling: true },
        data: { isDefaultBilling: false },
      });
    }

    return prisma.address.create({
      data: {
        userId,
        recipientName: addressData.recipientName,
        phoneNumber: addressData.phoneNumber,
        province: addressData.province,
        district: addressData.district,
        ward: addressData.ward,
        streetAddress: addressData.streetAddress,
        isDefaultShipping: addressData.isDefaultShipping,
        isDefaultBilling: addressData.isDefaultBilling,
      },
    });
  }

  async updateAddress(
    addressId: number,
    userId: number,
    addressData: Partial<typeof AddressZodSchema._type>
  ): Promise<Address> {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    if (addressData.isDefaultShipping) {
      await prisma.address.updateMany({
        where: { userId, isDefaultShipping: true },
        data: { isDefaultShipping: false },
      });
    }

    if (addressData.isDefaultBilling) {
      await prisma.address.updateMany({
        where: { userId, isDefaultBilling: true },
        data: { isDefaultBilling: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data: addressData,
    });
  }

  async deleteAddress(addressId: number, userId: number): Promise<Address> {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    return prisma.address.delete({
      where: { id: addressId },
    });
  }

  async getAddressById(addressId: number, userId: number): Promise<Address | null> {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    return address;
  }
}

export default new AddressService();
