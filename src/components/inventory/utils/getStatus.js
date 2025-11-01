export const getStatus = (p) => {
  const stock = p.stock_quantity ?? 0;
  const threshold = p.low_stock_threshold ?? 10;
  return stock === 0 ? "out of stock" : stock <= threshold ? "low stock" : "stock";
};
