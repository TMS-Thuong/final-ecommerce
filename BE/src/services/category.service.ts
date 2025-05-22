import { PrismaClient } from '@prisma/client';

import { CategoryErrorMessages } from '@app/constants/category.message';
import { ICategory } from '@app/types/category.type';

const prisma = new PrismaClient();

export class CategoryService {
  async getCategories(): Promise<ICategory[]> {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          parentCategoryId: true,
          displayOrder: true,
          isActive: true,
        },
        orderBy: {
          displayOrder: 'asc',
        },
      });
      return categories;
    } catch (error) {
      throw new Error(CategoryErrorMessages.FETCH_CATEGORIES_ERROR);
    }
  }

  async getCategoryById(id: number): Promise<ICategory | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          parentCategoryId: true,
          displayOrder: true,
          isActive: true,
        },
      });

      if (!category) return null;

      return category;
    } catch (error) {
      throw new Error(CategoryErrorMessages.FETCH_CATEGORY_ERROR);
    }
  }
}
