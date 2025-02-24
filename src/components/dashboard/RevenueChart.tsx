import { useQuery } from "@tanstack/react-query";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

type DailyRevenueData = {
  date: string;
  revenue: number;
};

const RevenueChart = () => {
  // Get current date boundaries
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const dayStart = startOfDay(today);
  const dayEnd = endOfDay(today);

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', dayStart, dayEnd],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            unit_price,
            item_id
          )
        `)
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());

      if (error) throw error;
      return data;
    },
    // Refetch every minute to keep data current
    refetchInterval: 60000
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('id, cost_price');

      if (error) throw error;
      return data;
    },
    // Refetch every minute
    refetchInterval: 60000
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['monthly-expenses', dayStart, dayEnd],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('amount')
        .gte('date', monthStart.toISOString())
        .lte('date', monthEnd.toISOString());

      if (error) throw error;
      return data;
    },
    // Refetch every minute
    refetchInterval: 60000
  });

  // Generate array of all days in current month
  const daysInMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  // Calculate revenue and costs
  const totalRevenue = orders.reduce((total, order) => total + (order.total_amount || 0), 0);
  
  // Calculate cost of goods sold
  const costOfGoodsSold = orders.reduce((total, order) => {
    const orderCost = order.order_items?.reduce((itemTotal, orderItem) => {
      const item = items.find(i => i.id === orderItem.item_id);
      if (item) {
        return itemTotal + (item.cost_price * orderItem.quantity);
      }
      return itemTotal;
    }, 0) || 0;
    return total + orderCost;
  }, 0);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + (expense.amount || 0), 0);

  // Calculate total cost (COGS + Expenses)
  const totalCost = costOfGoodsSold + totalExpenses;

  const netGain = totalRevenue - totalCost;

  // Calculate revenue for each day
  const dailyRevenue: DailyRevenueData[] = daysInMonth.map(day => {
    const dayRevenue = orders.reduce((total, order) => {
      const orderDate = new Date(order.created_at);
      if (format(orderDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')) {
        return total + (order.total_amount || 0);
      }
      return total;
    }, 0);

    return {
      date: format(day, 'MMM dd'),
      revenue: dayRevenue
    };
  });

  if (ordersLoading || itemsLoading || expensesLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Revenue Breakdown</h3>
        <div className="h-[300px] flex items-center justify-center">
          Loading revenue data...
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Monthly Financial Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <p className="text-2xl font-bold text-red-600">
              ${totalCost.toFixed(2)}
              <span className="block text-xs text-muted-foreground">
                (COGS: ${costOfGoodsSold.toFixed(2)} + Expenses: ${totalExpenses.toFixed(2)})
              </span>
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Net Gain</p>
            <p className={`text-2xl font-bold ${netGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netGain.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Daily Revenue Breakdown</h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const value = payload[0].value as number;
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">
                          Revenue: ${value.toFixed(2)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default RevenueChart;
