import { IProductBase } from './product.type';

export interface IBrand {
  id: number;
  name: string;
  logoPath: string | null;
  description: string | null;
  isActive: boolean;
}
