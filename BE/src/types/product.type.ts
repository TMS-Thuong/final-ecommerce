export interface IProducts {
  id: number;
  name: string;
  basePrice: number;
  salePrice: number | null;
  averageRating: number;
  ratingCount: number;
}

export interface IProduct {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: number;
  brandId: number;
  basePrice: number;
  salePrice: number | null;
  stockQuantity: number;
  averageRating: number;
  ratingCount: number;
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
