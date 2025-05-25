import { Decimal } from '@prisma/client/runtime/library';

export interface ProductImage {
  imageUrl: string;
}

export interface Product {
  id: number;
  name: string;
  basePrice: Decimal;
  salePrice: Decimal;
  stockQuantity: number;
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
