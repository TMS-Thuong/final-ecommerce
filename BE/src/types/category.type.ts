import { IProductBase } from './product.type';

export interface ICategory {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number | null;
  displayOrder: number;
  isActive: boolean;
}
