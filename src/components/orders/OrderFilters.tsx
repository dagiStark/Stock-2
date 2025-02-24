
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

const OrderFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: OrderFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <Input
        placeholder="Search by customer name or order ID..."
        className="max-w-sm"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Orders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Orders</SelectItem>
          <SelectItem value="pending" className="text-yellow-600">Pending</SelectItem>
          <SelectItem value="completed" className="text-green-600">Completed</SelectItem>
          <SelectItem value="cancelled" className="text-red-600">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrderFilters;
