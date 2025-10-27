export function normalizeCategory(product) {
  if (!product.categories || !product.categories.length) return "No Category";
  return product.categories.map(c => c.name).join(", ");
}
