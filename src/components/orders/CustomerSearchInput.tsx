
import { ChevronsUpDown } from "lucide-react";
import { Command, CommandInput } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import CustomerList from "./customer-search/CustomerList";
import EmptyState from "./customer-search/EmptyState";
import { useCustomerSearch } from "./customer-search/useCustomerSearch";
import type { CustomerSearchInputProps } from "./customer-search/types";

const CustomerSearchInput = ({ onCustomerSelect }: CustomerSearchInputProps) => {
  const {
    open,
    setOpen,
    value,
    setValue,
    searchValue,
    setSearchValue,
    customers,
    isLoading,
    handleCreateCustomer,
  } = useCustomerSearch(onCustomerSelect);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Search customers..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search customers..."
            value={searchValue}
            onValueChange={setSearchValue}
            disabled={isLoading}
          />
          <EmptyState
            isLoading={isLoading}
            searchValue={searchValue}
            onCreateCustomer={handleCreateCustomer}
          />
          {!isLoading && customers.length > 0 && (
            <CustomerList
              customers={customers}
              selectedValue={value}
              onSelect={(customer) => {
                setValue(customer.name);
                setSearchValue('');
                onCustomerSelect(customer);
                setOpen(false);
              }}
            />
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerSearchInput;
