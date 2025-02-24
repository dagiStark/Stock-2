
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import VendorProductsDialog from "./VendorProductsDialog";

interface Vendor {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

const VendorsList = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [productsDialogOpen, setProductsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchVendors();
  }, [searchQuery]); // Re-fetch when search query changes

  const fetchVendors = async () => {
    try {
      let query = supabase
        .from('vendors')
        .select('*');
      
      if (searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      setVendors(data || []);
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred while fetching vendors.",
      });
    }
  };

  const handleViewProducts = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setProductsDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-6">
        <Input
          placeholder="Search vendors by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {vendor.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {vendor.contact_person && (
                  <p className="text-sm text-muted-foreground">
                    Contact: {vendor.contact_person}
                  </p>
                )}
                {vendor.email && (
                  <p className="text-sm text-muted-foreground">
                    Email: {vendor.email}
                  </p>
                )}
                {vendor.phone && (
                  <p className="text-sm text-muted-foreground">
                    Phone: {vendor.phone}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleViewProducts(vendor)}
              >
                <Package className="h-4 w-4 mr-2" />
                View Products
              </Button>
            </CardContent>
          </Card>
        ))}

        {vendors.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            {searchQuery 
              ? "No vendors found matching your search."
              : "No vendors found. Add your first vendor to get started."}
          </div>
        )}

        <VendorProductsDialog
          open={productsDialogOpen}
          onOpenChange={setProductsDialogOpen}
          vendor={selectedVendor}
        />
      </div>
    </div>
  );
};

export default VendorsList;
