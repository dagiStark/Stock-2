import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Item {
  id: string;
  name: string;
  quantityRequired: number;
  quantityShipped: number;
  itemNumber: string;
  description: string;
  weightPerItem: number;
  unitPrice: number;
}

interface ItemsTableProps {
  items: Item[];
  onItemChange: (id: string, field: string, value: string | number) => void;
  onItemRemove: (id: string) => void;
  onItemAdd: () => void;
}

export const ItemsTable = ({
  items,
  onItemChange,
  onItemRemove,
  onItemAdd,
}: ItemsTableProps) => {
  return (
    <div className="mb-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>QTE REQ</TableHead>
            <TableHead>QTY SHIPPED</TableHead>
            <TableHead>Item #</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Weight/Item</TableHead>
            <TableHead>Total Weight</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Extended Price</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Input
                  value={item.name}
                  onChange={(e) =>
                    onItemChange(item.id, "name", e.target.value)
                  }
                  className="text-center rounded-none"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantityRequired}
                  onChange={(e) =>
                    onItemChange(item.id, "quantityRequired", parseFloat(e.target.value))
                  }
                  className="text-center rounded-none"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantityShipped}
                  onChange={(e) =>
                    onItemChange(item.id, "quantityShipped", parseFloat(e.target.value))
                  }
                  className="text-center rounded-none"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.itemNumber}
                  onChange={(e) =>
                    onItemChange(item.id, "itemNumber", e.target.value)
                  }
                  className="text-center rounded-none"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.description}
                  onChange={(e) =>
                    onItemChange(item.id, "description", e.target.value)
                  }
                  className="text-center rounded-none"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.weightPerItem}
                  onChange={(e) =>
                    onItemChange(item.id, "weightPerItem", parseFloat(e.target.value))
                  }
                  className="text-center rounded-none"
                />
              </TableCell>
              <TableCell className="text-center">
                {(item.weightPerItem * item.quantityShipped).toFixed(2)}
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    onItemChange(item.id, "unitPrice", parseFloat(e.target.value))
                  }
                  className="text-center rounded-none"
                />
              </TableCell>
              <TableCell className="text-center">
                ${(item.unitPrice * item.quantityShipped).toFixed(2)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onItemRemove(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={onItemAdd} className="mt-4">
        Add Item
      </Button>
    </div>
  );
};