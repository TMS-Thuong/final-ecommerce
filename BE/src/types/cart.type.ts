export interface ICartItem {
  id: number;
  cartId: string;
  productId: number;
  quantity: number;
  addedAt: Date;
  options?: Record<string, unknown>;
  product?: {
    id: number;
    name: string;
    basePrice: number;
    salePrice: number | null;
    stockQuantity: number;
    image: string | null;
  };
  price?: number;
  subtotal?: number;
}

export interface ICart {
  id: string;
  userId: number | null;
  items: ICartItem[];
  totalAmount?: number;
  totalItems?: number;
  createdAt: Date;
  updatedAt: Date;
}
