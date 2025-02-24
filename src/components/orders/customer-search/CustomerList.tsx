
import { Check } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Customer } from "./types";

interface CustomerListProps {
  customers: Customer[];
  selectedValue: string;
  onSelect: (customer: Customer) => void;
}

const CustomerList = ({ customers, selectedValue, onSelect }: CustomerListProps) => {
  return (
    <CommandGroup>
      {customers.map((customer) => (
        <CommandItem
          key={customer.id}
          value={customer.id}
          onSelect={() => onSelect(customer)}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              selectedValue === customer.name ? "opacity-100" : "opacity-0"
            )}
          />
          <div>
            <p>{customer.name}</p>
            {customer.phone && (
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            )}
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default CustomerList;
