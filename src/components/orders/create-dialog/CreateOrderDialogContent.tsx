
import { Order } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomerInfoForm from "../CustomerInfoForm";
import OrderItemsTable from "../OrderItemsTable";

interface CreateOrderDialogContentProps {
  formData: Order;
  setFormData: (data: Order) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateOrderDialogContent = ({
  formData,
  setFormData,
  isSubmitting,
  onSubmit,
  onCancel,
}: CreateOrderDialogContentProps) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 pr-4">
        <CustomerInfoForm formData={formData} setFormData={setFormData} />
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="paymentMethod" className="text-sm font-medium">
                Payment Method
              </label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value: Order['paymentMethod']) => {
                  setFormData({
                    ...formData,
                    paymentMethod: value,
                    creditDueDate: value === 'credit' 
                      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
                      : undefined
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COD">Cash on Delivery</SelectItem>
                  <SelectItem value="credit">Credit (30 days)</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <OrderItemsTable
          items={formData.items || []}
          onAddItem={() => {
            setFormData({
              ...formData,
              items: [
                ...(formData.items || []),
                {
                  itemId: "",
                  quantity: 1,
                  price: 0,
                  itemNumber: "",
                  description: "",
                  weightPerItem: 0,
                },
              ],
            });
          }}
          onUpdateItems={(items) =>
            setFormData({
              ...formData,
              items,
              total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            })
          }
        />
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderDialogContent;
