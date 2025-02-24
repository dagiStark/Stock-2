
import { Order, InvoiceType } from "@/types";
import { generateOrderPDF } from "@/utils/pdfUtils";
import { supabase } from "@/integrations/supabase/client";

export const getOrderItems = async (order: Order) => {
  if (!order || !Array.isArray(order.items)) {
    throw new Error("Invalid order data");
  }

  // Get all item IDs from the order
  const itemIds = order.items.map(item => item.itemId).filter(Boolean);

  // Fetch current item data from the database
  const { data: items } = await supabase
    .from('items')
    .select('id, name, price, weight')
    .in('id', itemIds);

  // Create a map of items for quick lookup
  const itemsMap = new Map(
    items?.map(item => [item.id, item]) || []
  );

  // Map order items with current item data
  return order.items.map(orderItem => {
    const item = itemsMap.get(orderItem.itemId);
    return {
      name: item?.name || orderItem.description || `Item ${orderItem.itemId}`,
      quantity: orderItem.quantity,
      price: orderItem.price,
      weightPerItem: item?.weight || orderItem.weightPerItem || 0
    };
  });
};

export const handlePDFGeneration = async (order: Order, invoiceType: InvoiceType = 'standard') => {
  try {
    if (!order.customerName || !order.customerPhone || !order.customerAddress) {
      throw new Error("Missing customer information");
    }

    const itemsWithNames = await getOrderItems(order);
    
    if (!itemsWithNames.length) {
      throw new Error("Order must have at least one item");
    }

    await generateOrderPDF(order, itemsWithNames, invoiceType);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  }
};
