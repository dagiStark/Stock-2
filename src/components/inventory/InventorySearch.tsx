import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventorySearchProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const InventorySearch = ({ 
  searchQuery, 
  statusFilter, 
  onSearchChange, 
  onStatusChange 
}: InventorySearchProps) => {
  return (
    <div className="flex items-center gap-4">
      <Input
        placeholder="Search items or vendors..."
        className="max-w-sm"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select 
        value={statusFilter}
        onValueChange={onStatusChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Items" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Items</SelectItem>
          <SelectItem value="red">Low Stock</SelectItem>
          <SelectItem value="yellow">Medium Stock</SelectItem>
          <SelectItem value="green">High Stock</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default InventorySearch;