export interface ProductBase {
  id: number;
  name: string;
  basePrice: number;
  salePrice: number | null;
  averageRating: number;
  ratingCount: number;
}

export interface Product extends ProductBase {
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
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
}