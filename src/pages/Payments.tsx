
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentsList from "@/components/payments/PaymentsList";
import { Payment } from "@/types";
import { useOrders } from "@/hooks/useOrders";

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { data: orders, isLoading } = useOrders();
  const [statusFilter, setStatusFilter] = useState<'all' | 'full' | 'partial' | 'unpaid'>('all');

  useEffect(() => {
    if (orders) {
      // Transform orders into payments
      const transformedPayments: Payment[] = orders.map(order => {
        const totalAmount = order.total;
        const amountPaid = order.amountPaid || 0;
        let paymentStatus = order.paymentStatus;

        // Recalculate payment status based on amount paid if needed
        if (!paymentStatus) {
          if (amountPaid >= totalAmount) {
            paymentStatus = 'full';
          } else if (amountPaid > 0) {
            paymentStatus = 'partial';
          } else {
            paymentStatus = 'unpaid';
          }
        }

        return {
          id: order.id,
          orderId: order.id,
          customerName: order.customerName,
          amount: amountPaid,
          date: order.date,
          total: totalAmount,
          remainingBalance: totalAmount - amountPaid,
          status: paymentStatus
        };
      });

      setPayments(transformedPayments);
    }
  }, [orders]);

  const filteredPayments = statusFilter === 'all' 
    ? payments 
    : payments.filter(payment => payment.status === statusFilter);

  const totals = payments.reduce((acc, payment) => {
    if (payment.status === 'full') {
      acc.fullPaid += payment.total;
    } else if (payment.status === 'partial') {
      acc.partialPaid += payment.total;
    } else {
      acc.unpaid += payment.total;
    }
    return acc;
  }, { fullPaid: 0, partialPaid: 0, unpaid: 0 });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground mt-2">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground mt-2">Track payment status for all orders.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card 
          className={`cursor-pointer transition-all ${statusFilter === 'full' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'full' ? 'all' : 'full')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totals.fullPaid.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all ${statusFilter === 'partial' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'partial' ? 'all' : 'partial')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partially Paid Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${totals.partialPaid.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all ${statusFilter === 'unpaid' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'unpaid' ? 'all' : 'unpaid')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totals.unpaid.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <PaymentsList payments={filteredPayments} />
    </div>
  );
};

export default Payments;
