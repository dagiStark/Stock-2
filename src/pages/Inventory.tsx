import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import InventoryList from "@/components/inventory/InventoryList";
import AddItemDialog from "@/components/inventory/AddItemDialog";

const Inventory = () => {
  const [addItemOpen, setAddItemOpen] = useState(false);

  useEffect(() => {
    // Check for filter in localStorage
    const filter = localStorage.getItem('inventoryFilter');
    if (filter) {
      // Remove the filter after reading it
      localStorage.removeItem('inventoryFilter');
      // The InventoryList component will handle the actual filtering
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground mt-2">Manage your inventory items here.</p>
        </div>
        <Button onClick={() => setAddItemOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <InventoryList />
      <AddItemDialog open={addItemOpen} onOpenChange={setAddItemOpen} />
    </div>
  );
};

export default Inventory;