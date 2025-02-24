
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import PaymentsSearch from "./PaymentsSearch";
import CreateStatementDialog from "./statement/CreateStatementDialog";
import PaymentsTable from "./PaymentsTable";

interface PaymentsListProps {
  payments: Payment[];
}

const PaymentsList = ({ payments: initialPayments }: PaymentsListProps) => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    setPayments(initialPayments);
  }, [initialPayments]);

  const handleAmountPaidChange = async (orderId: string, newAmount: number) => {
    try {
      const order = payments.find(p => p.orderId === orderId);
      if (!order) return;

      // Calculate new payment status based on the amount paid
      let newStatus: PaymentStatus = 'unpaid';
      if (newAmount >= order.total) {
        newStatus = 'full';
      } else if (newAmount > 0) {
        newStatus = 'partial';
      }

      const { error } = await supabase
        .from('orders')
        .update({
          amount_paid: newAmount,
          payment_status: newStatus
        })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setPayments(prevPayments =>
        prevPayments.map(payment => {
          if (payment.orderId === orderId) {
            return {
              ...payment,
              amount: newAmount,
              remainingBalance: payment.total - newAmount,
              status: newStatus
            };
          }
          return payment;
        })
      );

      toast({
        title: "Payment updated",
        description: "Payment amount has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment amount",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: PaymentStatus) => {
    try {
      const order = payments.find(p => p.orderId === orderId);
      if (!order) return;

      // Calculate new amount paid based on status
      const newAmountPaid = newStatus === 'full' ? order.total : 
                           newStatus === 'partial' ? order.total * 0.5 : 0;

      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: newStatus,
          amount_paid: newAmountPaid
        })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setPayments(prevPayments =>
        prevPayments.map(payment => {
          if (payment.orderId === orderId) {
            return {
              ...payment,
              status: newStatus,
              amount: newAmountPaid,
              remainingBalance: payment.total - newAmountPaid
            };
          }
          return payment;
        })
      );

      toast({
        title: "Status updated",
        description: "Payment status has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const filteredAndSortedPayments = useMemo(() => {
    let result = [...payments];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(payment =>
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort based on selected option
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.customerName.localeCompare(b.customerName));
        break;
      case "name-desc":
        result.sort((a, b) => b.customerName.localeCompare(a.customerName));
        break;
      case "total-asc":
        result.sort((a, b) => a.total - b.total);
        break;
      case "total-desc":
        result.sort((a, b) => b.total - a.total);
        break;
      case "remaining-asc":
        result.sort((a, b) => a.remainingBalance - b.remainingBalance);
        break;
      case "remaining-desc":
        result.sort((a, b) => b.remainingBalance - a.remainingBalance);
        break;
      case "status":
        result.sort((a, b) => {
          const statusOrder = {
            'unpaid': 0,
            'partial': 1,
            'full': 2
          };
          return statusOrder[a.status] - statusOrder[b.status];
        });
        break;
    }

    return result;
  }, [payments, searchTerm, sortBy]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PaymentsSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <CreateStatementDialog payments={payments} />
      </div>
      
      <PaymentsTable 
        payments={filteredAndSortedPayments}
        onStatusChange={handleStatusChange}
        onAmountPaidChange={handleAmountPaidChange}
      />
    </div>
  );
};

export default PaymentsList;
