
import { pdf } from "@react-pdf/renderer";
import { Order, InvoiceType } from "@/types";
import OrderInvoice from "@/components/orders/OrderInvoice";
import React from 'react';

export const generateOrderPDF = async (
  order: Order,
  items: Array<{ name: string; quantity: number; price: number; }>,
  invoiceType: InvoiceType = 'standard'
) => {
  try {
    // Validate order object
    if (!order) {
      throw new Error("Order data is missing");
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Order items are missing or invalid");
    }

    // Validate customer information
    if (!order.customerName?.trim()) {
      throw new Error("Customer name is required");
    }
    if (!order.customerPhone?.trim()) {
      throw new Error("Customer phone is required");
    }
    if (!order.customerAddress?.trim()) {
      throw new Error("Customer address is required");
    }

    // Create PDF document
    const doc = await pdf(
      <OrderInvoice order={order} items={items} invoiceType={invoiceType} />
    ).toBlob();
    
    if (!doc) {
      throw new Error("Failed to generate PDF blob");
    }

    // Create download link
    const url = URL.createObjectURL(doc);
    const link = document.createElement("a");
    link.href = url;
    const fileName = invoiceType === 'standard' 
      ? `invoice-${order.id}.pdf` 
      : `packing-list-${order.id}.pdf`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  }
};
