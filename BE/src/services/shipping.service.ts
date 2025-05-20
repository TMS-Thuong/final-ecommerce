import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ShippingService {
  async getShippingMethods(): Promise<unknown[]> {
    const count = await prisma.shippingMethod.count();

    if (count === 0) {
      await prisma.shippingMethod.createMany({
        data: [
          { name: 'Standard Shipping', description: 'Delivery within 3-5 business days' },
          { name: 'Express Shipping', description: 'Delivery within 1-2 business days' },
        ],
      });
    }

    return prisma.shippingMethod.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async calculateShippingFee(shippingMethodId: number, totalAmount: number): Promise<number> {
    const shippingMethod = await prisma.shippingMethod.findUnique({
      where: { id: shippingMethodId },
    });

    if (!shippingMethod) {
      try {
        await this.getShippingMethods();
        const method = await prisma.shippingMethod.findFirst();
        if (!method) {
          throw new Error('Shipping method not found');
        }
      } catch (error) {
        throw new Error('Shipping method not found');
      }
    }

    const baseFee = 30000;
    return totalAmount > 1000000 ? baseFee * 0.5 : baseFee;
  }
}

export default new ShippingService();
