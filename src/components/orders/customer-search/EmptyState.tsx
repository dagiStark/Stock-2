
import { Button } from "@/components/ui/button";
import { CommandEmpty } from "@/components/ui/command";

interface EmptyStateProps {
  isLoading: boolean;
  searchValue: string;
  onCreateCustomer: () => void;
}

const EmptyState = ({ isLoading, searchValue, onCreateCustomer }: EmptyStateProps) => {
  if (isLoading) {
    return <CommandEmpty>Loading...</CommandEmpty>;
  }

  if (!searchValue.trim()) {
    return null;
  }

  return (
    <CommandEmpty className="py-6 px-4">
      <p className="text-sm text-muted-foreground">No customer found.</p>
      <Button 
        variant="ghost" 
        className="mt-2 w-full justify-start font-medium"
        onClick={onCreateCustomer}
      >
        Create "{searchValue.trim()}" as new customer
      </Button>
    </CommandEmpty>
  );
};

export default EmptyState;
