
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import OrderInvoice from "./OrderInvoice";
import { Order, InvoiceType } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    weightPerItem?: number;
  }>;
  invoiceType?: InvoiceType;
}

const PDFPreviewDialog = ({
  open,
  onOpenChange,
  order,
  items,
  invoiceType = 'standard'
}: PDFPreviewDialogProps) => {
  if (!order || !items || items.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Error</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertDescription>
              Unable to preview invoice: Missing or invalid order data
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[800px]">
        <DialogHeader>
          <DialogTitle>Order Preview</DialogTitle>
        </DialogHeader>
        <PDFViewer width="100%" height="100%" className="rounded-md">
          <OrderInvoice order={order} items={items} invoiceType={invoiceType} />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
};

export default PDFPreviewDialog;
