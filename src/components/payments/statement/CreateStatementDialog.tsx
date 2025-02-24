
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { pdf } from "@react-pdf/renderer";
import CustomerStatementPDF from "./CustomerStatementPDF";
import { Payment } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CreateStatementDialogProps {
  payments: Payment[];
}

const CreateStatementDialog = ({ payments }: CreateStatementDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<{ name: string }[]>([]);
  const { toast } = useToast();

  const handleSearch = async (search: string) => {
    setSearchValue(search);
    if (!search) {
      setCustomers([]);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('name')
        .ilike('name', `%${search}%`)
        .limit(5);

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error searching customers:', error);
      toast({
        title: "Error",
        description: "Failed to search customers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerSelect = async (customerName: string) => {
    try {
      // Filter payments for the selected customer that are unpaid or partially paid
      const customerPayments = payments.filter(
        payment => 
          payment.customerName === customerName && 
          (payment.status === 'unpaid' || payment.status === 'partial')
      );

      if (customerPayments.length === 0) {
        toast({
          title: "No outstanding payments",
          description: "This customer has no unpaid or partially paid invoices.",
          variant: "default",
        });
        setOpen(false);
        return;
      }

      // Generate PDF
      const doc = await pdf(
        <CustomerStatementPDF 
          customerName={customerName}
          payments={customerPayments}
        />
      ).toBlob();

      // Create download link
      const url = URL.createObjectURL(doc);
      const link = document.createElement('a');
      link.href = url;
      link.download = `statement-${customerName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setOpen(false);
      toast({
        title: "Statement generated",
        description: "The customer statement has been downloaded.",
      });
    } catch (error) {
      console.error('Error generating statement:', error);
      toast({
        title: "Error",
        description: "Failed to generate customer statement",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <FileText className="mr-2 h-4 w-4" />
          Create Statement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Customer Statement</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search customers..."
              value={searchValue}
              onValueChange={handleSearch}
            />
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <CommandEmpty>No customers found.</CommandEmpty>
                <CommandGroup>
                  {customers.map((customer) => (
                    <CommandItem
                      key={customer.name}
                      value={customer.name}
                      onSelect={handleCustomerSelect}
                    >
                      {customer.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStatementDialog;
