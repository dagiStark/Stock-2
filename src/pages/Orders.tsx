import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import OrdersList from "@/components/orders/OrdersList";
import CreateOrderDialog from "@/components/orders/CreateOrderDialog";

const Orders = () => {
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">Manage your orders here.</p>
        </div>
        <Button onClick={() => setCreateOrderOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      <OrdersList />
      <CreateOrderDialog open={createOrderOpen} onOpenChange={setCreateOrderOpen} />
    </div>
  );
};

export default Orders;