import { Prisma, Product } from '@prisma/client';

export interface IProductBase {
  id: number;
  name: string;
  basePrice: number;
  salePrice: number | null;
  averageRating: number;
  ratingCount: number;
}

export interface IProduct extends IProductBase {
  [x: string]: unknown;
  sku: string;
  slug: string;
  description: string | null;
  categoryId: number;
  brandId: number;
  stockQuantity: number;
  viewCount: number;
  soldCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
}

export interface IProductWithImages extends IProduct {
  images: IProductImage[];
}

export type PrismaProductResult = Omit<Product, 'basePrice' | 'salePrice' | 'averageRating'> & {
  basePrice: Prisma.Decimal;
  salePrice: Prisma.Decimal | null;
  averageRating: Prisma.Decimal;
};

export interface PrismaProductWithImages extends PrismaProductResult {
  images: IProductImage[];
}
