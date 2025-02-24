import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { InventoryItem } from "@/types";

interface VendorProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: { id: string; name: string } | null;
}

const VendorProductsDialog = ({ open, onOpenChange, vendor }: VendorProductsDialogProps) => {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open && vendor) {
      fetchVendorProducts();
    }
  }, [open, vendor]);

  const fetchVendorProducts = async () => {
    if (!vendor) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('vendor', vendor.name);
      
      if (error) throw error;

      // Transform the Supabase data to match InventoryItem type
      const transformedProducts: InventoryItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        cost: item.cost_price,
        status: 'green', // Default status, you might want to calculate this based on thresholds
        image: item.image_url || undefined,
        weight: item.weight || 0,
        originalWeight: item.weight || 0,
        originalUnit: item.weight_unit as 'lb' | 'kg' | 'g' | 'oz' || 'kg',
        itemsPerPackage: item.items_per_package,
        vendor: item.vendor || undefined,
        description: item.description || undefined,
        barcode: item.barcode || undefined,
        yellowThreshold: item.yellow_threshold || 50,
        redThreshold: item.red_threshold || 20
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching vendor products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load vendor products. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Products by {vendor?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Quantity: {product.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  Cost: ${product.cost.toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found for this vendor.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorProductsDialog;
