import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Item {
  quantityShipped: number;
  weightPerItem: number;
  unitPrice: number;
}

interface SummarySectionProps {
  items: Item[];
  comments: string;
  onCommentsChange: (value: string) => void;
}

export const SummarySection = ({
  items,
  comments,
  onCommentsChange,
}: SummarySectionProps) => {
  const totalWeight = items.reduce(
    (sum, item) => sum + item.weightPerItem * item.quantityShipped,
    0
  );
  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantityShipped,
    0
  );
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantityShipped,
    0
  );

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <Label>Total Weight</Label>
          <p className="text-lg font-semibold">{totalWeight.toFixed(2)}</p>
        </div>
        <div>
          <Label>Total Quantity</Label>
          <p className="text-lg font-semibold">{totalQuantity}</p>
        </div>
        <div>
          <Label htmlFor="comments">Comments</Label>
          <Textarea
            id="comments"
            value={comments}
            onChange={(e) => onCommentsChange(e.target.value)}
            rows={4}
          />
        </div>
      </div>
      <div className="border p-4 space-y-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>USDTAX:</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Invoice Total:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};