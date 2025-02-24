
import { useState } from "react";
import { Order } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useCreateOrderForm = () => {
  const [formData, setFormData] = useState<Order>({
    id: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    date: new Date().toISOString(),
    total: 0,
    status: "pending",
    paymentStatus: "unpaid",
    amountPaid: 0,
    items: [], // Always initialized as an empty array
    paymentMethod: "COD", // Set default payment method
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all customer information fields",
        variant: "destructive",
      });
      return false;
    }

    // Ensure items array exists before checking length
    if (!formData.items || formData.items.length === 0) {
      toast({
        title: "No Items",
        description: "Please add at least one item to the order",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      id: "",
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      date: new Date().toISOString(),
      total: 0,
      status: "pending",
      paymentStatus: "unpaid",
      amountPaid: 0,
      items: [], // Reset with empty array
      paymentMethod: "COD", // Reset to default payment method
    });
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    resetForm,
  };
};
