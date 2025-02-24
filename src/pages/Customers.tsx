import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CustomersList from "@/components/customers/CustomersList";
import AddCustomerDialog from "@/components/customers/AddCustomerDialog";

const Customers = () => {
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground mt-2">
            Manage your customers and their information.
          </p>
        </div>
        <Button onClick={() => setAddCustomerOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <CustomersList />
      <AddCustomerDialog
        open={addCustomerOpen}
        onOpenChange={setAddCustomerOpen}
      />
    </div>
  );
};

export default Customers;