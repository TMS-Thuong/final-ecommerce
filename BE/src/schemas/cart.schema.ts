import { FastifySchema } from 'fastify';

export const getCartSchema: FastifySchema = {
  description: 'Get user cart',
  tags: ['cart'],
  summary: 'Get user cart',
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: ['string', 'null'], format: 'uuid' },
            userId: { type: ['integer', 'null'] },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  cartId: { type: 'string', format: 'uuid' },
                  productId: { type: 'integer' },
                  quantity: { type: 'integer' },
                  product: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                      basePrice: { type: 'number' },
                      salePrice: { type: ['number', 'null'] },
                      stockQuantity: { type: 'integer' },
                      image: { type: ['string', 'null'] },
                    },
                  },
                  price: { type: 'number' },
                  subtotal: { type: 'number' },
                  addedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            totalAmount: { type: 'number' },
            totalItems: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
};

export const addItemToCartSchema: FastifySchema = {
  description: 'Add an item to cart',
  tags: ['cart'],
  summary: 'Add an item to cart',
  body: {
    type: 'object',
    required: ['productId', 'quantity'],
    properties: {
      productId: { type: 'integer' },
      quantity: { type: 'integer', minimum: 1 },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            addedItem: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                cartId: { type: 'string', format: 'uuid' },
                productId: { type: 'integer' },
                quantity: { type: 'integer' },
                addedAt: { type: 'string', format: 'date-time' },
              },
            },
            cart: {
              type: 'object',
              properties: {
                id: { type: ['string', 'null'], format: 'uuid' },
                userId: { type: ['integer', 'null'] },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      cartId: { type: 'string', format: 'uuid' },
                      productId: { type: 'integer' },
                      quantity: { type: 'integer' },
                      product: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          name: { type: 'string' },
                          basePrice: { type: 'number' },
                          salePrice: { type: ['number', 'null'] },
                          stockQuantity: { type: 'integer' },
                          image: { type: ['string', 'null'] },
                        },
                      },
                      price: { type: 'number' },
                      subtotal: { type: 'number' },
                      addedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
                totalAmount: { type: 'number' },
                totalItems: { type: 'integer' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  },
};

export const updateCartItemSchema: FastifySchema = {
  description: 'Update cart item quantity',
  tags: ['cart'],
  summary: 'Update cart item quantity',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    required: ['quantity'],
    properties: {
      quantity: { type: 'integer', minimum: 1 },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            updatedItem: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                cartId: { type: 'string', format: 'uuid' },
                productId: { type: 'integer' },
                quantity: { type: 'integer' },
                addedAt: { type: 'string', format: 'date-time' },
              },
            },
            cart: {
              type: 'object',
              properties: {
                id: { type: ['string', 'null'], format: 'uuid' },
                userId: { type: ['integer', 'null'] },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      cartId: { type: 'string', format: 'uuid' },
                      productId: { type: 'integer' },
                      quantity: { type: 'integer' },
                      product: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          name: { type: 'string' },
                          basePrice: { type: 'number' },
                          salePrice: { type: ['number', 'null'] },
                          stockQuantity: { type: 'integer' },
                          image: { type: ['string', 'null'] },
                        },
                      },
                      price: { type: 'number' },
                      subtotal: { type: 'number' },
                      addedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
                totalAmount: { type: 'number' },
                totalItems: { type: 'integer' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  },
};

export const deleteCartItemSchema: FastifySchema = {
  description: 'Remove item from cart',
  tags: ['cart'],
  summary: 'Remove item from cart',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            cart: {
              type: 'object',
              properties: {
                id: { type: ['string', 'null'], format: 'uuid' },
                userId: { type: ['integer', 'null'] },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      cartId: { type: 'string', format: 'uuid' },
                      productId: { type: 'integer' },
                      quantity: { type: 'integer' },
                      product: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          name: { type: 'string' },
                          basePrice: { type: 'number' },
                          salePrice: { type: ['number', 'null'] },
                          stockQuantity: { type: 'integer' },
                          image: { type: ['string', 'null'] },
                        },
                      },
                      price: { type: 'number' },
                      subtotal: { type: 'number' },
                      addedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
                totalAmount: { type: 'number' },
                totalItems: { type: 'integer' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  },
};
