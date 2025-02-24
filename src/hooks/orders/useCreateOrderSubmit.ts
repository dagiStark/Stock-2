
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateOrderSubmit = (
  formData: Order,
  setIsSubmitting: (value: boolean) => void,
  onOpenChange: (open: boolean) => void,
  resetForm: () => void
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    console.log("Starting order submission with formData:", formData);
    
    if (!formData.items) {
      console.error("Items array is undefined");
      toast({
        title: "Error",
        description: "Order items are missing. Please add items to your order.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      if (!Array.isArray(formData.items)) {
        throw new Error("Invalid items format");
      }

      const total = formData.items.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        return sum + (price * quantity);
      }, 0);

      console.log("Calculated total:", total);

      // Create the order with payment method
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_address: formData.customerAddress,
          total_amount: total,
          created_by: user.id,
          status: 'pending',
          payment_method: formData.paymentMethod,
          credit_due_date: formData.paymentMethod === 'credit' ? formData.creditDueDate : null
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        throw orderError;
      }

      if (!orderData) {
        throw new Error("No order data returned after creation");
      }

      console.log("Order created:", orderData);

      const orderItems = formData.items.map(item => ({
        order_id: orderData.id,
        item_id: item.itemId || null,
        quantity: Number(item.quantity),
        unit_price: Number(item.price),
        description: item.description || "",
        item_number: item.itemNumber || "",
        weight_per_item: Number(item.weightPerItem) || 0,
      }));

      console.log("Prepared order items:", orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error("Order items creation error:", itemsError);
        throw itemsError;
      }

      // Show different toast message based on payment method
      const toastMessage = formData.paymentMethod === 'credit' 
        ? "Order created successfully. Payment due in 30 days."
        : "Order created successfully";

      toast({
        title: "Success",
        description: toastMessage,
      });

      resetForm();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onOpenChange(false);

    } catch (error: any) {
      console.error("Error creating order:", error);
      const errorMessage = error.message || 
                          (error.error_description || 
                          (error.details || 
                          "An unknown error occurred while creating the order"));
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};
