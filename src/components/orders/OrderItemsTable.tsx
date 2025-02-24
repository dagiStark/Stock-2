
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import OrderItemRow from "./OrderItemRow";
import { Order } from "@/types";

interface OrderItemsTableProps {
  items: Order['items'];
  onAddItem?: () => void;
  onUpdateItems?: (items: Order['items']) => void;
  editingItemId?: string | null;
  editedPrice?: number;
  editedQuantity?: number;
  onStartEditing?: (itemId: string, quantity: number, price: number) => void;
  onCancelEditing?: () => void;
  onSaveChanges?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
  setEditedPrice?: (price: number) => void;
  setEditedQuantity?: (quantity: number) => void;
}

const OrderItemsTable = ({ 
  items,
  onAddItem,
  onUpdateItems,
  editingItemId,
  editedPrice,
  editedQuantity,
  onStartEditing,
  onCancelEditing,
  onSaveChanges,
  onDelete,
  setEditedPrice,
  setEditedQuantity,
}: OrderItemsTableProps) => {
  const handleDeleteItem = (itemId: string) => {
    if (onDelete) {
      onDelete(itemId);
    } else if (onUpdateItems) {
      onUpdateItems(items.filter(item => item.itemId !== itemId));
    }
  };

  const handleUpdateItem = (itemId: string, updatedItem: Order['items'][0]) => {
    if (onUpdateItems) {
      onUpdateItems(items.map(item => item.itemId === itemId ? updatedItem : item));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Order Items</h3>
        <Button onClick={onAddItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      <div className="overflow-x-auto scrollbar-visible" style={{
        overflowX: 'auto',
        scrollbarWidth: 'auto',
        scrollbarColor: 'rgb(203 213 225) transparent'
      }}>
        <Table className="min-w-[1200px] relative">
          <TableHeader>
            <TableRow className="[&>th]:py-4 [&>th]:text-base sticky top-0 bg-white z-10">
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="min-w-[120px]">QTE REQ</TableHead>
              <TableHead className="min-w-[120px]">QTY SHIPPED</TableHead>
              <TableHead className="min-w-[150px]">Item #</TableHead>
              <TableHead className="min-w-[250px]">Description</TableHead>
              <TableHead className="min-w-[120px]">Weight/Item</TableHead>
              <TableHead className="min-w-[120px]">Total Weight</TableHead>
              <TableHead className="min-w-[120px]">Unit Price</TableHead>
              <TableHead className="min-w-[120px]">Extended Price</TableHead>
              <TableHead className="min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <OrderItemRow
                key={item.itemId}
                item={item}
                isEditing={editingItemId === item.itemId}
                editedPrice={editedPrice}
                editedQuantity={editedQuantity}
                onUpdate={(updatedItem) => handleUpdateItem(item.itemId, updatedItem)}
                onDelete={() => handleDeleteItem(item.itemId)}
                onStartEditing={onStartEditing}
                onCancelEditing={onCancelEditing}
                onSaveChanges={onSaveChanges}
                setEditedPrice={setEditedPrice}
                setEditedQuantity={setEditedQuantity}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderItemsTable;
