
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface CustomerSearchInputProps {
  onCustomerSelect: (customer: Customer) => void;
}
