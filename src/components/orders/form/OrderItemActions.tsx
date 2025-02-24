import { Button } from "@/components/ui/button";
import { Check, Trash2, X } from "lucide-react";

interface OrderItemActionsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
}

const OrderItemActions = ({
  isEditing,
  onSave,
  onCancel,
  onStartEdit,
  onDelete,
}: OrderItemActionsProps) => {
  if (isEditing) {
    return (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSave}
          className="text-green-500 hover:text-green-700"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onStartEdit}
        className="text-blue-500 hover:text-blue-700"
      >
        Edit
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OrderItemActions;