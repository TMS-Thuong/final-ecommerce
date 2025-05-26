import { Decimal } from '@prisma/client/runtime/library';

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: number;
  brandId: number;
  basePrice: Decimal;
  salePrice: Decimal | null;
  stockQuantity: number;
  averageRating: Decimal;
  ratingCount: number;
  viewCount: number;
  soldCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImage[];
}

export interface FavoriteItem {
  id: number;
  favoriteId: number;
  productId: number;
  product: Product;
}

export interface Favorite {
  id: number;
  userId: number;
  createdAt: Date;
  items: FavoriteItem[];
}

export interface TransformedProduct {
  id: number;
  name: string;
  basePrice: number;
  salePrice: number;
  stockQuantity: number;
  images: string[];
}

export interface TransformedFavoriteItem {
  id: number;
  favoriteId: number;
  productId: number;
  product: TransformedProduct;
}

export interface TransformedFavorite {
  id: number;
  userId: number;
  createdAt: Date;
  items: TransformedFavoriteItem[];
}
