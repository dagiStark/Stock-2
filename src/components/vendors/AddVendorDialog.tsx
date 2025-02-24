
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
import VendorForm from "./VendorForm";
import { useVendorValidation } from "./useVendorValidation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddVendorDialog = ({ open, onOpenChange }: AddVendorDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { checkExistingVendor } = useVendorValidation();
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    fax: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check for existing vendor with same phone number
      if (formData.phone) {
        const existingVendor = await checkExistingVendor(formData.phone);
        
        if (existingVendor) {
          toast({
            variant: "destructive",
            title: "Vendor Already Exists",
            description: `A vendor named "${existingVendor.name}" is already registered with this phone number.`,
          });
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabase
        .from('vendors')
        .insert([{
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Error adding vendor:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from insert operation');
      }

      toast({
        title: "Success",
        description: "Vendor added successfully.",
      });

      onOpenChange(false);
      setFormData({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        fax: "",
        address: "",
      });
      
      // Trigger a refresh of the vendors list
      window.dispatchEvent(new CustomEvent('refreshVendors'));
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add vendor. Please try again.",
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
          <DialogTitle>Add New Vendor</DialogTitle>
          <DialogDescription>
            Fill in the vendor details below to add a new vendor to your system.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <VendorForm
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

export default AddVendorDialog;
