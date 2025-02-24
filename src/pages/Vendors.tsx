import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import VendorsList from "@/components/vendors/VendorsList";
import AddVendorDialog from "@/components/vendors/AddVendorDialog";

const Vendors = () => {
  const [addVendorOpen, setAddVendorOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground mt-2">Manage your vendors and their products.</p>
        </div>
        <Button onClick={() => setAddVendorOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <VendorsList />
      <AddVendorDialog open={addVendorOpen} onOpenChange={setAddVendorOpen} />
    </div>
  );
};

export default Vendors;