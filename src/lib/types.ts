export interface Product {
  id: string;
  scientificName: string;
  commonName: string;
  categoryId: string;
  barcode: string;
  sku: string;
  unit: string;
  tags: string[];
  description: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  uses: string;
  ingredients: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  notes: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface StockCheck {
  id: string;
  date: Date;
  products: StockCheckItem[];
  notes: string;
}

export interface StockCheckItem {
  productId: string;
  productName: string;
  expectedQuantity: number;
  actualQuantity: number;
  difference: number;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export type ActivityType = 'stock_check' | 'product_add' | 'low_stock';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  link?: string;
}
