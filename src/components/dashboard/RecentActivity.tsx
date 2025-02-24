
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import EditOrderDialog from "@/components/orders/EditOrderDialog";
import EditItemDialog from "@/components/inventory/EditItemDialog";
import { InventoryItem } from "@/types";
import { useOrders } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";

const RecentActivity = () => {
  const { data: orders = [] } = useOrders();
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editOrderOpen, setEditOrderOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      // Using raw SQL to properly compare quantity with red_threshold
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .filter('quantity', 'lte', 'red_threshold')
        .limit(5);

      if (error) {
        console.error('Error fetching low stock items:', error);
        return;
      }

      if (data) {
        // Map the database items to match our InventoryItem type
        const mappedItems: InventoryItem[] = data.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          cost: item.cost_price,
          status: item.quantity <= item.red_threshold ? 'red' : 
                 item.quantity <= item.yellow_threshold ? 'yellow' : 'green',
          image: item.image_url,
          weight: item.weight || 0,
          originalWeight: item.weight || 0,
          // Ensure weight_unit is one of the allowed values, default to 'lb'
          originalUnit: (item.weight_unit as 'lb' | 'kg' | 'g' | 'oz') || 'lb',
          itemsPerPackage: item.items_per_package,
          vendor: item.vendor,
          description: item.description,
          barcode: item.barcode,
          yellowThreshold: item.yellow_threshold,
          redThreshold: item.red_threshold
        }));
        setLowStockItems(mappedItems);
      }
    };

    fetchLowStockItems();
  }, []);

  // Get the 5 most recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditOrderOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditItemOpen(true);
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-muted-foreground text-sm md:text-base">
              No recent orders
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div>
                    <h3 className="font-medium">{order.customerName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()} - {order.items.length} items
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="font-semibold">${order.total.toFixed(2)}</span>
                      <div className="text-sm">
                        <span
                          className={`capitalize ${
                            order.status === "completed"
                              ? "text-green-600"
                              : order.status === "cancelled"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditOrder(order)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Critical Low Stock Items</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {lowStockItems.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-muted-foreground text-sm md:text-base">
              No items are currently below their critical threshold (red status)
            </div>
          ) : (
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-red-600">
                        Critical: Only {item.quantity} items left (below threshold of {item.redThreshold})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">${item.price.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditItem(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditOrderDialog
        open={editOrderOpen}
        onOpenChange={setEditOrderOpen}
        order={selectedOrder}
      />
      <EditItemDialog
        open={editItemOpen}
        onOpenChange={setEditItemOpen}
        item={selectedItem}
      />
    </div>
  );
};

export default RecentActivity;
