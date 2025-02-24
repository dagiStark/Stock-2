
import { useState } from "react";
import { Order } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOrderItems = (formData: Order | null, setFormData: (data: Order) => void) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedQuantity, setEditedQuantity] = useState<number>(0);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const { toast } = useToast();

  const startEditingItem = (itemId: string, quantity: number, price: number) => {
    setEditingItemId(itemId);
    setEditedQuantity(quantity);
    setEditedPrice(price);
  };

  const cancelEditingItem = () => {
    setEditingItemId(null);
    setEditedQuantity(0);
    setEditedPrice(0);
  };

  const handleAddItem = async () => {
    if (!formData) return;
    
    try {
      const newItem = {
        order_id: formData.id,
        quantity: 1,
        unit_price: 0,
        description: "",
        item_number: "",
        weight_per_item: 0
      };

      const { data: insertedItem, error } = await supabase
        .from('order_items')
        .insert(newItem)
        .select()
        .single();

      if (error) throw error;

      if (insertedItem) {
        const newOrderItem = {
          itemId: insertedItem.id,
          quantity: insertedItem.quantity,
          price: insertedItem.unit_price,
          description: insertedItem.description || "",
          itemNumber: insertedItem.item_number || "",
          weightPerItem: insertedItem.weight_per_item || 0
        };

        const updatedItems = [...formData.items, newOrderItem];
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        setFormData({
          ...formData,
          items: updatedItems,
          total: newTotal
        });

        toast({
          title: "Item added",
          description: "New item has been added to the order",
        });
      }
    } catch (error) {
      console.error('Add item error:', error);
      toast({
        title: "Error",
        description: "Failed to add new item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!itemId || !formData) {
      console.error('Invalid item ID for deletion');
      return;
    }

    try {
      const { error } = await supabase
        .from('order_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      const updatedItems = formData.items.filter(item => item.itemId !== itemId);
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      setFormData({
        ...formData,
        items: updatedItems,
        total: newTotal
      });

      toast({
        title: "Item deleted",
        description: "The item has been removed from the order",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const saveItemChanges = async (itemId: string) => {
    if (!itemId || !formData) {
      console.error('Invalid item ID for update');
      return;
    }

    try {
      const { error } = await supabase
        .from('order_items')
        .update({
          quantity: editedQuantity,
          unit_price: editedPrice
        })
        .eq('id', itemId);

      if (error) throw error;

      const updatedItems = formData.items.map(item => 
        item.itemId === itemId 
          ? { ...item, quantity: editedQuantity, price: editedPrice }
          : item
      );
      
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      setFormData({
        ...formData,
        items: updatedItems,
        total: newTotal
      });

      setEditingItemId(null);
      
      toast({
        title: "Changes saved",
        description: "The item has been updated successfully",
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  return {
    editingItemId,
    editedQuantity,
    editedPrice,
    startEditingItem,
    cancelEditingItem,
    handleAddItem,
    handleDeleteItem,
    saveItemChanges,
    setEditedQuantity,
    setEditedPrice,
  };
};
