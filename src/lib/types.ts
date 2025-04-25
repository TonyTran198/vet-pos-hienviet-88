
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

// Added to support UI components for StockCheck page
export interface StockCheckUIItem extends StockCheckItem {
  id: string;
  name: string;
  commonName?: string;
  isChecked: boolean;
  categoryId: string;
  barcode: string;
}

// New types for MVP 2 features

export type SupplierType = 'individual' | 'business';
export type SupplierStatus = 'active' | 'inactive';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit' | 'other';

export interface Supplier {
  id: string;
  type: SupplierType;
  businessName?: string;
  ownerName: string;
  taxCode?: string;
  idNumber: string;
  phone: string;
  email?: string;
  address: string;
  contactPerson?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  paymentMethod?: PaymentMethod;
  tags: string[];
  status: SupplierStatus;
  note?: string;
  createdAt: Date;
  orderCount: number;
}

export type PurchaseOrderStatus = 'draft' | 'final' | 'canceled';

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  scientificName: string;
  commonName?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  isPercentage: boolean;
  subTotal: number;
  note?: string;
}

export interface PurchaseOrder {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  date: Date;
  items: PurchaseOrderItem[];
  subTotal: number;
  totalDiscount: number;
  total: number;
  status: PurchaseOrderStatus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceHistory {
  id: string;
  productId: string;
  oldPrice: number;
  newPrice: number;
  date: Date;
  source: 'purchase_order' | 'manual';
  purchaseOrderId?: string;
}

export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  discount?: number;
  isPercentage: boolean;
  tags: string[];
  groupId?: string;
  note?: string;
  createdAt: Date;
  orderCount: number;
  status: CustomerStatus;
}

export interface CustomerGroup {
  id: string;
  name: string;
  description?: string;
  discount: number;
  isPercentage: boolean;
  customerCount: number;
  conditions?: CustomerGroupCondition[];
  createdAt: Date;
}

export interface CustomerGroupCondition {
  id: string;
  type: 'min_orders' | 'min_spend' | 'tag';
  value: string | number;
}
