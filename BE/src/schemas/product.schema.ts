import { Type } from '@sinclair/typebox';

// Base schemas
export const ErrorResponseSchema = Type.Object({
  statusCode: Type.Number(),
  code: Type.String(),
  message: Type.String(),
});

export const ProductImageSchema = Type.Object({
  id: Type.Number(),
  productId: Type.Number(),
  imageUrl: Type.String(),
  isThumbnail: Type.Boolean(),
  displayOrder: Type.Number(),
});

export const ProductBaseSchema = Type.Object({
  id: Type.Number(),
  sku: Type.String(),
  name: Type.String(),
  slug: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  categoryId: Type.Number(),
  brandId: Type.Number(),
  basePrice: Type.Number(),
  salePrice: Type.Union([Type.Number(), Type.Null()]),
  stockQuantity: Type.Number(),
  averageRating: Type.Number(),
  ratingCount: Type.Number(),
  viewCount: Type.Number(),
  soldCount: Type.Number(),
  isActive: Type.Boolean(),
  isFeatured: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const ProductWithImagesSchema = Type.Intersect([
  ProductBaseSchema,
  Type.Object({
    images: Type.Array(ProductImageSchema),
  }),
]);

export const ProductAttributeSchema = Type.Object({
  id: Type.Number(),
  value: Type.Record(Type.String(), Type.Unknown()),
  isVariantAttribute: Type.Boolean(),
});

export const CategorySchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

export const BrandSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

export const ProductDetailsSchema = Type.Intersect([
  ProductBaseSchema,
  Type.Object({
    images: Type.Array(ProductImageSchema),
    attributes: Type.Array(ProductAttributeSchema),
    category: CategorySchema,
    brand: BrandSchema,
  }),
]);

// Route schemas
export const GetProductsSchema = {
  summary: 'Get list of active products',
  tags: ['Product'],
  querystring: Type.Object({
    page: Type.Number({ default: 1 }),
    pageSize: Type.Number({ default: 10 }),
    brandId: Type.Optional(Type.Number()),
    categoryId: Type.Optional(Type.Number()),
    minPrice: Type.Optional(Type.Number({ minimum: 0 })),
    maxPrice: Type.Optional(Type.Number({ minimum: 0 })),
    stockStatus: Type.Optional(Type.Union([Type.Literal('inStock'), Type.Literal('outOfStock')])),
    searchQuery: Type.Optional(Type.String()),
    sortBy: Type.Optional(
      Type.String({
        enum: ['newest', 'priceAsc', 'priceDesc', 'rating'],
        description: 'Sort products by: newest, priceAsc, priceDesc, rating',
      })
    ),
    onSale: Type.Optional(Type.Boolean()),
    averageRating: Type.Optional(Type.Number({ minimum: 1, maximum: 5 })),
  }),
  response: {
    200: Type.Object({
      success: Type.Boolean(),
      data: Type.Array(ProductWithImagesSchema),
    }),
    500: ErrorResponseSchema,
  },
};

export const GetProductByIdSchema = {
  summary: 'Get a product by its ID',
  tags: ['Product'],
  params: Type.Object({
    id: Type.Number(),
  }),
  response: {
    200: Type.Object({
      success: Type.Boolean(),
      data: Type.Union([ProductDetailsSchema, Type.Null()]),
    }),
    404: ErrorResponseSchema,
    500: ErrorResponseSchema,
  },
};

export const GetProductImagesSchema = {
  summary: 'Get all images for a product by its ID',
  tags: ['Product'],
  params: Type.Object({
    productId: Type.Number(),
  }),
  response: {
    200: Type.Object({
      success: Type.Boolean(),
      data: Type.Array(ProductImageSchema),
    }),
    404: ErrorResponseSchema,
    500: ErrorResponseSchema,
  },
};
