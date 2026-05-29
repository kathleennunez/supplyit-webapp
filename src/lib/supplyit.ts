export type Trend = "Going Up" | "Going Down" | "Stable";

export type Product = {
  id: string;
  name: string;
  stock: number;
  latestPrice: number;
  previousPrice: number;
  lowStockThreshold: number;
};

export const sampleProducts: Product[] = [
  { id: "tomato", name: "Tomato", stock: 22, latestPrice: 58, previousPrice: 64, lowStockThreshold: 30 },
  { id: "onion", name: "Onion", stock: 40, latestPrice: 85, previousPrice: 78, lowStockThreshold: 25 },
  { id: "cabbage", name: "Cabbage", stock: 18, latestPrice: 35, previousPrice: 35, lowStockThreshold: 20 },
  { id: "eggplant", name: "Eggplant", stock: 10, latestPrice: 72, previousPrice: 88, lowStockThreshold: 20 },
  { id: "carrot", name: "Carrot", stock: 55, latestPrice: 49, previousPrice: 51, lowStockThreshold: 30 },
];

export const regions = ["NCR", "Region III", "Region IV-A", "Region VII"];

export function trendFor(product: Product): Trend {
  if (product.latestPrice > product.previousPrice) return "Going Up";
  if (product.latestPrice < product.previousPrice) return "Going Down";
  return "Stable";
}

export function isLowStock(product: Product): boolean {
  return product.stock <= product.lowStockThreshold;
}

export function percentChange(product: Product): number {
  if (product.previousPrice === 0) return 0;
  return ((product.latestPrice - product.previousPrice) / product.previousPrice) * 100;
}

export function suggestionFor(product: Product): { action: string; reason: string } {
  const trend = trendFor(product);
  const lowStock = isLowStock(product);

  if (trend === "Going Down" && lowStock) {
    return { action: "Buy more", reason: `${product.name} price dropped while stock is low.` };
  }
  if (trend === "Going Up" && !lowStock) {
    return { action: "Wait first", reason: `${product.name} price is rising and stock is still enough.` };
  }
  if (trend === "Stable" && lowStock) {
    return { action: "Restock soon", reason: `${product.name} price is stable but stock is near minimum.` };
  }
  if (trend === "Going Up" && lowStock) {
    return { action: "Buy small amount", reason: `${product.name} is needed but price is rising.` };
  }
  return { action: "Monitor", reason: `${product.name} is currently in an acceptable range.` };
}
