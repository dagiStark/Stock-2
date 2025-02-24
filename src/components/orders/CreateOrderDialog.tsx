
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateOrderForm } from "@/hooks/orders/useCreateOrderForm";
import { useCreateOrderSubmit } from "@/hooks/orders/useCreateOrderSubmit";
import CreateOrderDialogContent from "./create-dialog/CreateOrderDialogContent";
import { Order } from "@/types";

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateOrderDialog = ({ open, onOpenChange }: CreateOrderDialogProps) => {
  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    validateForm,
  } = useCreateOrderForm();

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
      items: [],
      paymentMethod: "COD", // Set default payment method
    });
  };

  const { handleSubmit } = useCreateOrderSubmit(
    formData,
    setIsSubmitting,
    onOpenChange,
    resetForm
  );

  const onSubmit = async () => {
    if (!validateForm() || isSubmitting) return;
    setIsSubmitting(true);
    await handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <CreateOrderDialogContent
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderDialog;
