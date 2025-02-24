
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import AddCustomerDialog from "./AddCustomerDialog";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  description: string | null;
}

const CustomersList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
    // Add event listener for customer refresh
    window.addEventListener('refreshCustomers', fetchCustomers);
    return () => {
      window.removeEventListener('refreshCustomers', fetchCustomers);
    };
  }, []);

  const fetchCustomers = async () => {
    try {
      let query = supabase
        .from('customers')
        .select('*');
      
      if (searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load customers. Please try again.",
      });
    }
  };

  // Add effect to trigger search when query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCustomers();
    }, 300); // Debounce search for better performance

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div>
      <div className="mb-6">
        <Input
          placeholder="Search customers by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {customer.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {customer.email && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {customer.email}
                  </p>
                )}
                {customer.phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {customer.phone}
                  </p>
                )}
                {customer.description && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    {customer.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {customers.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            {searchQuery
              ? "No customers found matching your search."
              : "No customers found. Add your first customer to get started."}
          </div>
        )}
      </div>

      <AddCustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default CustomersList;
