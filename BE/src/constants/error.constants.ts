export enum ErrorCode {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  INVALID_ORDER_ID = 'INVALID_ORDER_ID',
  INVALID_ORDER_DATA = 'INVALID_ORDER_DATA',
  ORDER_ALREADY_CANCELLED = 'ORDER_ALREADY_CANCELLED',
  ORDER_ALREADY_PAID = 'ORDER_ALREADY_PAID',

  ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND',
  INVALID_ADDRESS_ID = 'INVALID_ADDRESS_ID',
  INVALID_ADDRESS_DATA = 'INVALID_ADDRESS_DATA',

  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INVALID_PAYMENT_DATA = 'INVALID_PAYMENT_DATA',

  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',

  INVALID_SHIPPING_DATA = 'INVALID_SHIPPING_DATA',
  SHIPPING_METHOD_NOT_FOUND = 'SHIPPING_METHOD_NOT_FOUND',
  PAYMENT_URL_CREATION_FAILED = 'PAYMENT_URL_CREATION_FAILED',
}
