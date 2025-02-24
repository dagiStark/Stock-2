
import { TableCell, TableRow } from "@/components/ui/table";
import { Order } from "@/types";
import { useState } from "react";
import OrderItemInput from "./form/OrderItemInput";
import OrderItemActions from "./form/OrderItemActions";
import ItemSearchInput from "./form/ItemSearchInput";

interface OrderItemRowProps {
  item: Order['items'][0];
  isEditing?: boolean;
  editedPrice?: number;
  editedQuantity?: number;
  onUpdate: (updatedItem: Order['items'][0]) => void;
  onDelete: () => void;
  onStartEditing?: (itemId: string, quantity: number, price: number) => void;
  onCancelEditing?: () => void;
  onSaveChanges?: (itemId: string) => void;
  setEditedPrice?: (price: number) => void;
  setEditedQuantity?: (quantity: number) => void;
}

const OrderItemRow = ({
  item,
  isEditing,
  editedPrice,
  editedQuantity,
  onUpdate,
  onDelete,
  onStartEditing,
  onCancelEditing,
  onSaveChanges,
  setEditedPrice,
  setEditedQuantity,
}: OrderItemRowProps) => {
  const [localItem, setLocalItem] = useState(item);
  const [itemName, setItemName] = useState(item.itemNumber || "");
  
  const handleChange = (field: keyof Order['items'][0], value: any) => {
    const updatedItem = { ...localItem, [field]: value };
    setLocalItem(updatedItem);
    onUpdate(updatedItem);
  };

  const handleItemSelect = (selectedItem: { 
    id: string; 
    name: string; 
    price: number;
    description?: string;
    barcode?: string;
    weight?: number;
  }) => {
    const updatedItem = {
      ...localItem,
      itemNumber: selectedItem.barcode || "",
      description: selectedItem.description || "",
      price: selectedItem.price,
      weightPerItem: selectedItem.weight || 0
    };
    setLocalItem(updatedItem);
    onUpdate(updatedItem);
    setItemName(selectedItem.name);
  };

  const quantity = isEditing ? editedQuantity || localItem.quantity : localItem.quantity;
  const price = isEditing ? editedPrice || localItem.price : localItem.price;
  const totalWeight = Number(localItem.weightPerItem || 0) * Number(quantity);
  const extendedPrice = price * quantity;

  return (
    <TableRow className="[&>td]:py-3">
      <TableCell>
        <ItemSearchInput
          value={itemName}
          onChange={setItemName}
          onItemSelect={handleItemSelect}
        />
      </TableCell>
      <TableCell>
        <OrderItemInput
          type="number"
          value={quantity}
          onChange={(value) => {
            if (isEditing && setEditedQuantity) {
              setEditedQuantity(Number(value));
            } else {
              handleChange('quantity', Number(value));
            }
          }}
          min="0"
        />
      </TableCell>
      <TableCell>
        <OrderItemInput
          type="number"
          value={quantity}
          disabled={true}
          min="0"
        />
      </TableCell>
      <TableCell>
        <OrderItemInput
          value={localItem.itemNumber || ""}
          onChange={(value) => handleChange('itemNumber', value)}
          placeholder="Enter item #"
          disabled={true}
        />
      </TableCell>
      <TableCell>
        <OrderItemInput
          value={localItem.description || ""}
          onChange={(value) => handleChange('description', value)}
          placeholder="Enter description"
          disabled={true}
        />
      </TableCell>
      <TableCell>
        <OrderItemInput
          type="number"
          value={localItem.weightPerItem || 0}
          onChange={(value) => handleChange('weightPerItem', Number(value))}
          min="0"
          step="0.01"
          disabled={true}
        />
      </TableCell>
      <TableCell>
        <OrderItemInput
          type="number"
          value={totalWeight}
          readOnly
          className="bg-gray-50"
        />
      </TableCell>
      <TableCell>
        <OrderItemInput
          type="number"
          value={price}
          onChange={(value) => {
            if (isEditing && setEditedPrice) {
              setEditedPrice(Number(value));
            } else {
              handleChange('price', Number(value));
            }
          }}
          min="0"
          step="0.01"
          disabled={true}
        />
      </TableCell>
      <TableCell>
        <OrderItemInput
          type="number"
          value={extendedPrice}
          readOnly
          className="bg-gray-50"
        />
      </TableCell>
      <TableCell>
        <OrderItemActions
          isEditing={isEditing || false}
          onSave={() => onSaveChanges?.(item.itemId)}
          onCancel={onCancelEditing || (() => {})}
          onStartEdit={() => onStartEditing?.(item.itemId, item.quantity, item.price)}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default OrderItemRow;
