import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const PaymentsSearch = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}: PaymentsSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1">
        <Input
          placeholder="Search by customer name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="total-asc">Total Amount (Low-High)</SelectItem>
          <SelectItem value="total-desc">Total Amount (High-Low)</SelectItem>
          <SelectItem value="remaining-asc">Remaining (Low-High)</SelectItem>
          <SelectItem value="remaining-desc">Remaining (High-Low)</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaymentsSearch;