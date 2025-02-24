
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CustomerForm from "./CustomerForm";
import { useCustomerValidation } from "./useCustomerValidation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCustomerDialog = ({ open, onOpenChange }: AddCustomerDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { checkExistingCustomer } = useCustomerValidation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fax: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check for existing customer with same phone number
      if (formData.phone) {
        const existingCustomer = await checkExistingCustomer(formData.phone);
        
        if (existingCustomer) {
          toast({
            variant: "destructive",
            title: "Customer Already Exists",
            description: `A customer named "${existingCustomer.name}" is already registered with this phone number.`,
          });
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase
        .from('customers')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer added successfully.",
      });

      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        fax: "",
        description: "",
      });
      
      // Trigger a refresh of the customers list
      window.dispatchEvent(new CustomEvent('refreshCustomers'));
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add customer. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Fill in the customer details below to add a new customer to your system.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <CustomerForm
            formData={formData}
            loading={loading}
            onCancel={() => onOpenChange(false)}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
