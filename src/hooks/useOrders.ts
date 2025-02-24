
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useOrders = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching orders",
          description: error.message,
          variant: "destructive",
        });
        console.error("Error fetching orders:", error);
        return [];
      }

      if (!data) {
        return [];
      }

      return data.map(order => ({
        id: order.id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        date: order.created_at,
        total: Number(order.total_amount),
        status: order.status as Order['status'],
        paymentStatus: (order.payment_status || 'unpaid') as Order['paymentStatus'],
        amountPaid: 0,
        items: (order.order_items || []).map(item => ({
          itemId: item.item_id || '',
          quantity: item.quantity || 0,
          price: Number(item.unit_price) || 0,
          itemNumber: item.item_number || '',
          description: item.description || '',
          weightPerItem: Number(item.weight_per_item) || 0
        })),
        paymentMethod: (order.payment_method || 'COD') as Order['paymentMethod']
      }));
    },
  });
};
