import { Product, ProductImage, ProductAttributeValue, Category, Brand } from '@prisma/client';

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

export interface IProductWithImages extends Omit<Product, 'basePrice' | 'salePrice' | 'averageRating'> {
  basePrice: number;
  salePrice: number;
  averageRating: number;
  images: IProductImage[];
}

export interface IProductAttribute {
  id: number;
  value: Record<string, unknown>;
  isVariantAttribute: boolean;
}

export interface IProductDetails extends Omit<Product, 'basePrice' | 'salePrice' | 'averageRating'> {
  basePrice: number;
  salePrice: number | null;
  averageRating: number;
  productAttributeValues: (ProductAttributeValue & {
    attribute: {
      id: number;
      value: string;
      isVariantAttribute: boolean;
    };
  })[];
  images: ProductImage[];
  category: Category;
  brand: Brand;
  attributes: IProductAttribute[];
}

export type PrismaProductResult = Product;
export type PrismaProductWithImages = Product & { images: ProductImage[] };
