import React, { useState } from "react";
import { CompanyHeader } from "./CompanyHeader";
import { AddressSection } from "./AddressSection";
import { OrderInfoSection } from "./OrderInfoSection";
import { ItemsTable } from "./ItemsTable";
import { SummarySection } from "./SummarySection";
import { Footer } from "./Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Item {
  id: string;
  name: string;
  quantityRequired: number;
  quantityShipped: number;
  itemNumber: string;
  description: string;
  weightPerItem: number;
  unitPrice: number;
}

export const InvoiceForm = () => {
  const { toast } = useToast();
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    phone: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    phone: "",
  });

  const [orderInfo, setOrderInfo] = useState({
    salesperson: "",
    shipVia: "",
    location: "",
    terms: "C.O.D.",
    taxNumber: "",
  });

  const [items, setItems] = useState<Item[]>([]);
  const [comments, setComments] = useState("");

  const handleBillingChange = (field: string, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleShippingChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrderInfoChange = (field: string, value: string) => {
    setOrderInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (id: string, field: string, value: string | number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleItemRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemAdd = () => {
    const newItem: Item = {
      id: crypto.randomUUID(),
      name: "",
      quantityRequired: 0,
      quantityShipped: 0,
      itemNumber: "",
      description: "",
      weightPerItem: 0,
      unitPrice: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    try {
      const total = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantityShipped,
        0
      );

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: billingAddress.name,
          customer_address: billingAddress.address,
          customer_phone: billingAddress.phone,
          shipping_name: shippingAddress.name,
          shipping_address: shippingAddress.address,
          shipping_city: shippingAddress.city,
          shipping_country: shippingAddress.country,
          shipping_phone: shippingAddress.phone,
          salesperson: orderInfo.salesperson,
          ship_via: orderInfo.shipVia,
          location: orderInfo.location,
          terms: orderInfo.terms,
          tax_number: orderInfo.taxNumber,
          total_amount: total,
          comments,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        item_number: item.itemNumber,
        description: item.description,
        quantity: item.quantityShipped,
        quantity_required: item.quantityRequired,
        unit_price: item.unitPrice,
        weight_per_item: item.weightPerItem,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Success",
        description: "Order saved successfully",
      });
    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        title: "Error",
        description: "Failed to save order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-full md:max-w-[8.5in] mx-auto p-4 md:p-8 bg-white">
      <div className="space-y-4 md:space-y-6 print:space-y-4">
        <div className="overflow-x-auto">
          <CompanyHeader />
          <AddressSection
            billingAddress={billingAddress}
            shippingAddress={shippingAddress}
            onBillingChange={handleBillingChange}
            onShippingChange={handleShippingChange}
          />
          <OrderInfoSection orderInfo={orderInfo} onChange={handleOrderInfoChange} />
          <ItemsTable
            items={items}
            onItemChange={handleItemChange}
            onItemRemove={handleItemRemove}
            onItemAdd={handleItemAdd}
          />
          <SummarySection
            items={items}
            comments={comments}
            onCommentsChange={setComments}
          />
          <Footer />
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-4 print:hidden sticky bottom-4 bg-white p-4 border-t">
        <Button onClick={handleSave}>Save Order</Button>
        <Button onClick={handlePrint}>Print</Button>
      </div>
    </div>
  );
};