import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryItem } from "@/types";
import InventoryTableRow from "./InventoryTableRow";

interface InventoryTableProps {
  items: InventoryItem[];
  statusColors: Record<string, string>;
  onEdit: (item: InventoryItem) => void;
}

const InventoryTable = ({ items, statusColors, onEdit }: InventoryTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IMAGE</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead>VENDOR</TableHead>
            <TableHead>QUANTITY</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <InventoryTableRow
                key={item.id}
                item={item}
                statusColors={statusColors}
                onEdit={onEdit}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;