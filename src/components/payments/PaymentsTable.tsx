
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Payment, PaymentStatus } from "@/types";
import PaymentStatusSelect from "./PaymentStatusSelect";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PaymentsTableProps {
  payments: Payment[];
  onStatusChange: (orderId: string, status: PaymentStatus) => void;
  onAmountPaidChange: (orderId: string, amount: number) => void;
}

const PaymentsTable = ({ payments, onStatusChange, onAmountPaidChange }: PaymentsTableProps) => {
  const [editingAmount, setEditingAmount] = useState<{id: string, value: string}>({ id: '', value: '' });

  const handleAmountEdit = (payment: Payment) => {
    setEditingAmount({ id: payment.orderId, value: payment.amount.toString() });
  };

  const handleAmountSave = (payment: Payment) => {
    const newAmount = parseFloat(editingAmount.value);
    if (!isNaN(newAmount) && newAmount >= 0 && newAmount <= payment.total) {
      onAmountPaidChange(payment.orderId, newAmount);
    }
    setEditingAmount({ id: '', value: '' });
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, payment: Payment) => {
    if (e.key === 'Enter') {
      handleAmountSave(payment);
    } else if (e.key === 'Escape') {
      setEditingAmount({ id: '', value: '' });
    }
  };

  return (
    <div className="border rounded-lg overflow-auto">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ORDER ID</TableHead>
              <TableHead>CUSTOMER</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>REMAINING</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-24 text-muted-foreground"
                >
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.orderId}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>${payment.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {editingAmount.id === payment.orderId ? (
                      <Input
                        type="number"
                        value={editingAmount.value}
                        onChange={(e) => setEditingAmount({ ...editingAmount, value: e.target.value })}
                        onBlur={() => handleAmountSave(payment)}
                        onKeyDown={(e) => handleAmountKeyDown(e, payment)}
                        className="w-24"
                        min={0}
                        max={payment.total}
                        step={0.01}
                        autoFocus
                      />
                    ) : (
                      <div
                        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => handleAmountEdit(payment)}
                      >
                        ${payment.amount.toFixed(2)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>${payment.remainingBalance.toFixed(2)}</TableCell>
                  <TableCell>
                    <PaymentStatusSelect
                      status={payment.status}
                      onStatusChange={(value) => onStatusChange(payment.orderId, value)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentsTable;
