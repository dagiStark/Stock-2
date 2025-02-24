
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  total: number;
  loading: boolean;
  onCancel: () => void;
}

const OrderSummary = ({ total, loading, onCancel }: OrderSummaryProps) => {
  return (
    <div className="flex justify-between items-center pt-4">
      <div>
        <p className="text-sm text-muted-foreground">Total:</p>
        <p className="text-xl font-semibold">
          ${total.toFixed(2)}
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          Update Order
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
