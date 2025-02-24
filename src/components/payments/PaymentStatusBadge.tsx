
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types";

export const statusColors = {
  full: "bg-green-50 text-green-700 border-green-100",
  partial: "bg-yellow-50 text-yellow-700 border-yellow-100",
  unpaid: "bg-red-50 text-red-700 border-red-100",
};

export const statusLabels = {
  full: "PAID",
  partial: "PARTIAL",
  unpaid: "UNPAID",
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={statusColors[status]}
    >
      {statusLabels[status]}
    </Badge>
  );
};

export default PaymentStatusBadge;
