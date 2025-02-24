
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/types";
import CustomerSearchInput from "./CustomerSearchInput";

interface CustomerInfoFormProps {
  formData: Order;
  setFormData: (data: Order) => void;
}

const CustomerInfoForm = ({ formData, setFormData }: CustomerInfoFormProps) => {
  const handleCustomerSelect = (customer: { 
    name: string; 
    phone?: string; 
    address?: string;
  }) => {
    setFormData({
      ...formData,
      customerName: customer.name,
      customerPhone: customer.phone || "",
      customerAddress: customer.address || "",
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Customer</Label>
          <CustomerSearchInput onCustomerSelect={handleCustomerSelect} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              required
              className="rounded-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.customerPhone}
              onChange={(e) =>
                setFormData({ ...formData, customerPhone: e.target.value })
              }
              required
              className="rounded-none"
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.customerAddress}
          onChange={(e) =>
            setFormData({ ...formData, customerAddress: e.target.value })
          }
          required
          className="rounded-none"
        />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: 'pending' | 'completed' | 'cancelled') =>
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger className="rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default CustomerInfoForm;
