
import { useState, useEffect } from "react";
import { InventoryItem } from "@/types";
import EditItemDialog from "./EditItemDialog";
import InventorySearch from "./InventorySearch";
import InventoryTable from "./InventoryTable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  red: "bg-red-50 text-red-700 border-red-100",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
  green: "bg-green-50 text-green-700 border-green-100",
};

const InventoryList = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!data) {
        setItems([]);
        return;
      }

      const transformedItems: InventoryItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
        cost: Number(item.cost_price),
        status: determineStatus(item.quantity, item.yellow_threshold, item.red_threshold),
        image: item.image_url,
        itemsPerPackage: item.items_per_package,
        vendor: item.vendor,
        description: item.description,
        barcode: item.barcode,
        weight: item.weight || 0,
        originalWeight: item.weight || 0,
        originalUnit: item.weight_unit as 'lb' | 'kg' | 'g' | 'oz' || 'kg',
        yellowThreshold: item.yellow_threshold || 50,
        redThreshold: item.red_threshold || 20
      }));

      setItems(transformedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch inventory items.",
      });
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchItems();

    // Set up realtime subscription
    const channel = supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items'
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const determineStatus = (quantity: number, yellowThreshold: number = 50, redThreshold: number = 20): 'green' | 'yellow' | 'red' => {
    if (quantity <= redThreshold) return 'red';
    if (quantity <= yellowThreshold) return 'yellow';
    return 'green';
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setEditDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setEditingItem(null);
      fetchItems();
    }
  };

  const filteredItems = items
    .filter(item => 
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (item.vendor && item.vendor.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (statusFilter === "all" || item.status === statusFilter)
    )
    .sort((a, b) => {
      const statusPriority = { red: 0, yellow: 1, green: 2 };
      return statusPriority[a.status] - statusPriority[b.status];
    });

  return (
    <div className="space-y-4">
      <InventorySearch
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
      />

      <InventoryTable
        items={filteredItems}
        statusColors={statusColors}
        onEdit={handleEdit}
      />

      <EditItemDialog 
        open={editDialogOpen}
        onOpenChange={handleDialogClose}
        item={editingItem}
      />
    </div>
  );
};

export default InventoryList;
