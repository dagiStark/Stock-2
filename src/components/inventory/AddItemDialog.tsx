
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { InventoryItem } from "@/types";
import InventoryItemForm from "./InventoryItemForm";
import { supabase } from "@/integrations/supabase/client";
import { convertToPounds } from "@/utils/weightConversion";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddItemDialog = ({ open, onOpenChange }: AddItemDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: Partial<InventoryItem>) => {
    try {
      setLoading(true);

      // Convert weight to pounds for storage and calculations
      const weightInPounds = formData.weight && formData.originalUnit 
        ? convertToPounds(formData.weight, formData.originalUnit)
        : 0;

      // If vendor name is provided, get or create vendor
      let vendorName = formData.vendor;
      if (vendorName) {
        const { data: vendors, error: vendorCheckError } = await supabase
          .from('vendors')
          .select('name')
          .eq('name', vendorName);

        if (vendorCheckError) throw vendorCheckError;

        // If vendor doesn't exist, create it
        if (!vendors || vendors.length === 0) {
          const { error: vendorError } = await supabase
            .from('vendors')
            .insert([{ 
              name: vendorName,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);

          if (vendorError) throw vendorError;
        }
      }

      // Insert the new item with threshold information
      const { error: itemError } = await supabase
        .from('items')
        .insert([{
          name: formData.name,
          quantity: formData.quantity || 0,
          price: formData.price || 0,
          cost_price: formData.cost || 0,
          image_url: formData.image,
          items_per_package: formData.itemsPerPackage || 1,
          vendor: formData.vendor,
          description: formData.description,
          barcode: formData.barcode,
          weight: weightInPounds,
          weight_unit: formData.originalUnit,
          yellow_threshold: formData.yellowThreshold || 50,
          red_threshold: formData.redThreshold || 20,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (itemError) throw itemError;

      toast({
        title: "Success",
        description: "Item added successfully",
      });

      onOpenChange(false);
      window.dispatchEvent(new CustomEvent('refreshInventory'));
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Inventory</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <InventoryItemForm
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            loading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
