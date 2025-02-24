import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "./types";

export const useCustomerSearch = (
  onCustomerSelect: (customer: Customer) => void
) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const searchCustomers = async () => {
      const trimmedSearch = searchValue.trim();
      if (!trimmedSearch) {
        setCustomers([]);
        return;
      }

      setIsLoading(true);
      try {
        const safeSearch = trimmedSearch?.trim() || "";

        const { data, error } = await supabase
          .from("customers")
          .select("id, name, phone, address, email")
          .ilike("name", `%${safeSearch}%`)
          .order("name", { ascending: true })
          .limit(5);

        if (error) {
          console.error("Error fetching customers:", error.message);
          return [];
        }

        console.log("Customers: ", data);
        const customersList = data || [];
        // setCustomers(customersList.map(customer => ({
        //   id: customer.id,
        //   name: customer.name || '',
        //   phone: customer.phone || '',
        //   address: customer.address || '',
        //   email: customer.email || '',
        // })));
        setCustomers(customersList);
      } catch (error) {
        console.error("Error searching customers:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to search customers",
        });
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchCustomers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchValue, toast]);

  const handleCreateCustomer = async () => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("customers")
        .insert([
          {
            name: trimmedValue,
            phone: "",
            address: "",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No data returned after customer creation");

      const newCustomer: Customer = {
        id: data.id,
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        email: data.email || "",
      };

      toast({
        title: "Success",
        description: "New customer created successfully",
      });

      onCustomerSelect(newCustomer);
      setOpen(false);
      setValue(newCustomer.name);
      setSearchValue("");
      setCustomers([]);
    } catch (error) {
      console.error("Error creating customer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create customer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    open,
    setOpen,
    value,
    setValue,
    searchValue,
    setSearchValue,
    customers,
    isLoading,
    handleCreateCustomer,
  };
};
