
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Order } from "@/types";
import CustomerInfoForm from "./CustomerInfoForm";
import OrderItemsTable from "./OrderItemsTable";
import OrderSummary from "./form/OrderSummary";
import { useOrderEdit } from "@/hooks/useOrderEdit";

interface EditOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const EditOrderDialog = ({ open, onOpenChange, order }: EditOrderDialogProps) => {
  const {
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
    handleSubmit,
    setEditedQuantity,
    setEditedPrice,
    handleAddItem
  } = useOrderEdit(order, onOpenChange);

  if (!formData) return null;

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        // Only allow closing if not in the middle of loading
        if (!loading) {
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CustomerInfoForm formData={formData} setFormData={setFormData} />
          <OrderItemsTable
            items={formData.items}
            editingItemId={editingItemId}
            editedPrice={editedPrice}
            editedQuantity={editedQuantity}
            onStartEditing={startEditingItem}
            onCancelEditing={cancelEditingItem}
            onSaveChanges={saveItemChanges}
            onDelete={handleDeleteItem}
            setEditedPrice={setEditedPrice}
            setEditedQuantity={setEditedQuantity}
            onAddItem={handleAddItem}
          />
          <OrderSummary 
            total={formData.total}
            loading={loading}
            onCancel={() => !loading && onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;
