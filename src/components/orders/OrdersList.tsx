
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types";
import EditOrderDialog from "./EditOrderDialog";
import PDFPreviewDialog from "./PDFPreviewDialog";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";
import OrderFilters from "./OrderFilters";
import OrderActions from "./OrderActions";
import { handlePDFGeneration, getOrderItems } from "./utils/orderUtils";

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  completed: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
};

const OrdersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);
  const [previewItems, setPreviewItems] = useState<Array<{ name: string; quantity: number; price: number; weightPerItem: number; }>>([]);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const { toast } = useToast();
  const { data: orders = [], isLoading, error } = useOrders();

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setEditDialogOpen(true);
  };

  const handleGeneratePDF = async (order: Order) => {
    try {
      await handlePDFGeneration(order);
      toast({
        title: "Success",
        description: "Invoice PDF has been generated",
      });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast({
        title: "Error generating PDF",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePreviewInvoice = async (order: Order) => {
    try {
      const itemsWithNames = await getOrderItems(order);
      setPreviewOrder(order);
      setPreviewItems(itemsWithNames);
      setPreviewDialogOpen(true);
    } catch (error) {
      console.error("Preview Error:", error);
      toast({
        title: "Error previewing invoice",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return <div>Error loading orders: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || (
      (order.customerName?.toLowerCase() || '').includes(searchLower) ||
      (order.id?.toLowerCase() || '').includes(searchLower)
    );
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ORDER ID</TableHead>
              <TableHead>CUSTOMER</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-muted-foreground"
                >
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[order.status]}
                    >
                      {order.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <OrderActions
                      order={order}
                      onEdit={handleEditOrder}
                      onPreview={handlePreviewInvoice}
                      onGeneratePDF={handleGeneratePDF}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditOrderDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        order={editingOrder}
      />
      
      <PDFPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        order={previewOrder}
        items={previewItems}
      />
    </div>
  );
};

export default OrdersList;
