export interface Order {
  id?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentStatus: PaymentStatus;
  amountPaid: number;
  paymentMethod: 'COD' | 'credit' | 'cash' | 'check';
  creditDueDate?: string;
}

export interface OrderItem {
  itemId: string;
  itemNumber: string;
  quantity: number;
  price: number;
  description?: string;
  weightPerItem: number;
}

export type PaymentStatus = 'full' | 'partial' | 'unpaid';

export interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  date: string;
  total: number;
  remainingBalance: number;
  status: PaymentStatus;
}

export type InvoiceType = 'standard' | 'packing-slip';

export interface Expense {
  id?: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

export interface ExpenseLimit {
  id: string;
  category: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface TotalExpenseLimit {
  id: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  cost: number;
  status: 'green' | 'yellow' | 'red';
  image?: string;
  weight: number;
  originalWeight: number;
  originalUnit: 'lb' | 'kg' | 'g' | 'oz';
  itemsPerPackage: number;
  vendor?: string;
  description?: string;
  barcode?: string;
  yellowThreshold: number;
  redThreshold: number;
}
