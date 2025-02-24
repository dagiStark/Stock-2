
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentStatus } from "@/types";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface PaymentStatusSelectProps {
  status: PaymentStatus;
  onStatusChange: (value: PaymentStatus) => void;
}

const PaymentStatusSelect = ({ status, onStatusChange }: PaymentStatusSelectProps) => {
  return (
    <Select
      value={status}
      onValueChange={onStatusChange}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          <PaymentStatusBadge status={status} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="full">
          <PaymentStatusBadge status="full" />
        </SelectItem>
        <SelectItem value="partial">
          <PaymentStatusBadge status="partial" />
        </SelectItem>
        <SelectItem value="unpaid">
          <PaymentStatusBadge status="unpaid" />
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PaymentStatusSelect;
