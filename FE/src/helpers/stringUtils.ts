export const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
};
