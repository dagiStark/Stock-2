import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types";

interface InventoryTableRowProps {
  item: InventoryItem;
  statusColors: Record<string, string>;
  onEdit: (item: InventoryItem) => void;
}

const InventoryTableRow = ({ item, statusColors, onEdit }: InventoryTableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.vendor || '-'}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>${item.price.toFixed(2)}</TableCell>
      <TableCell>
        <Badge variant="outline" className={statusColors[item.status]}>
          {item.status.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default InventoryTableRow;