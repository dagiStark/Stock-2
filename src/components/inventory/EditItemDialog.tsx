
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { InventoryItem } from "@/types";
import InventoryItemForm from "./InventoryItemForm";
import { supabase } from "@/integrations/supabase/client";
import { convertToPounds } from "@/utils/weightConversion";

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

const EditItemDialog = ({ open, onOpenChange, item }: EditItemDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: Partial<InventoryItem>) => {
    if (!item?.id) {
      console.error("No item ID provided for update");
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("You must be authenticated to update items");
      }

      // First, validate the data
      if (!formData.name || formData.quantity === undefined || !formData.price || !formData.cost) {
        throw new Error("Missing required fields");
      }

      // Upload image to storage if provided
      let imageUrl = formData.image;
      if (imageUrl && imageUrl.startsWith('data:')) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('item_images')
          .upload(`${item.id}/${Date.now()}`, 
            await (await fetch(imageUrl)).blob(), 
            { upsert: true }
          );

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('item_images')
          .getPublicUrl(uploadData.path);
          
        imageUrl = publicUrl;
      }

      // Convert weight to pounds for storage
      const weightInPounds = formData.weight && formData.originalUnit 
        ? convertToPounds(formData.weight, formData.originalUnit)
        : 0;

      // Format the data to match Supabase schema
      const updatePayload = {
        name: formData.name,
        quantity: formData.quantity,
        price: Number(formData.price),
        cost_price: Number(formData.cost),
        image_url: imageUrl || null,
        items_per_package: Number(formData.itemsPerPackage || 1),
        vendor: formData.vendor || null,
        description: formData.description || null,
        barcode: formData.barcode || null,
        weight: weightInPounds,
        weight_unit: formData.originalUnit,
        yellow_threshold: formData.yellowThreshold || 50,
        red_threshold: formData.redThreshold || 20,
        updated_at: new Date().toISOString()
      };

      // Log the payload for debugging
      console.log("Sending update payload:", updatePayload, "for item ID:", item.id);

      // Perform the update with explicit field selection and maybeSingle
      const { data: updatedItem, error } = await supabase
        .from('items')
        .update(updatePayload)
        .eq('id', item.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Error updating item:", error);
        throw error;
      }

      if (!updatedItem) {
        throw new Error("Update failed - no rows affected");
      }

      console.log("Update successful. Updated data:", updatedItem);

      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      onOpenChange(false);
      // Trigger a refresh of the inventory list
      window.dispatchEvent(new CustomEvent('refreshInventory'));
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update item",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <InventoryItemForm
            initialData={item}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            loading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
