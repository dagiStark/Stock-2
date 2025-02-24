
import { useState, useCallback } from "react";
import { Order } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOrderSubmit = (onOpenChange: (open: boolean) => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = useCallback(async (formData: Order, e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setLoading(true);
    try {
      const calculatedTotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const { error } = await supabase
        .from('orders')
        .update({
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_address: formData.customerAddress,
          total_amount: calculatedTotal,
          status: formData.status
        })
        .eq('id', formData.id);

      if (error) throw error;

      // Update all order items
      for (const item of formData.items) {
        if (!item.itemId) {
          console.error('Invalid item ID for update:', item);
          continue;
        }

        const { error: itemError } = await supabase
          .from('order_items')
          .update({
            quantity: item.quantity,
            unit_price: item.price
          })
          .eq('id', item.itemId);

        if (itemError) throw itemError;
      }

      toast({
        title: "Order updated",
        description: "The order has been updated successfully",
      });
      
      // Only close the dialog after all operations are successful
      setTimeout(() => {
        onOpenChange(false);
      }, 500);
      
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [onOpenChange, toast]);

  return {
    loading,
    handleSubmit,
  };
};
