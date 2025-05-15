export interface IProductBase {
  id: number;
  name: string;
  basePrice: number;
  salePrice: number | null;
  averageRating: number;
  ratingCount: number;
}

export interface IProduct extends IProductBase {
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
}

export interface IProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
}
