
import { FileText, FileBox, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order } from "@/types";
import { handlePDFGeneration } from "./utils/orderUtils";

interface OrderActionsProps {
  order: Order;
  onEdit: (order: Order) => void;
  onPreview: (order: Order) => void;
  onGeneratePDF: (order: Order) => void;
}

const OrderActions = ({ order, onEdit, onPreview }: OrderActionsProps) => {
  const handleGenerateStandardPDF = async () => {
    try {
      await handlePDFGeneration(order, 'standard');
    } catch (error) {
      console.error("Failed to generate standard PDF:", error);
    }
  };

  const handleGeneratePackingList = async () => {
    try {
      await handlePDFGeneration(order, 'packing-slip');
    } catch (error) {
      console.error("Failed to generate packing list:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onPreview(order)}>
          <Pencil className="mr-2 h-4 w-4" />
          Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(order)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleGenerateStandardPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Download Invoice
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleGeneratePackingList}>
          <FileBox className="mr-2 h-4 w-4" />
          Download Packing List
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderActions;
