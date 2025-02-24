
export interface DatabaseOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  created_at: string;
  total_amount: number;
  payment_status: string;
  amount_paid: number;
  status: string;
}
