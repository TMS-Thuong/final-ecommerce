export const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'boolean' },
    code: { type: 'string' },
    message: { type: 'string' },
  },
};
