
import { useState, useEffect, useCallback } from "react";
import { Order } from "@/types";
import { useOrderItems } from "./orders/useOrderItems";
import { useOrderSubmit } from "./orders/useOrderSubmit";

export const useOrderEdit = (order: Order | null, onOpenChange: (open: boolean) => void) => {
  const [formData, setFormData] = useState<Order | null>(null);
  
  useEffect(() => {
    if (order) {
      setFormData(order);
    }
  }, [order]);

  const {
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
  } = useOrderItems(formData, setFormData);

  const { loading, handleSubmit } = useOrderSubmit(onOpenChange);

  const wrappedHandleSubmit = useCallback((e: React.FormEvent) => {
    if (!formData) return;
    handleSubmit(formData, e);
  }, [formData, handleSubmit]);

  return {
    loading,
    formData,
    setFormData,
    editingItemId,
    editedQuantity,
    editedPrice,
    startEditingItem,
    cancelEditingItem,
    handleDeleteItem,
    saveItemChanges,
    handleSubmit: wrappedHandleSubmit,
    setEditedQuantity,
    setEditedPrice,
    handleAddItem
  };
};
