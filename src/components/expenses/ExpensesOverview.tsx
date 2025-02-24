
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { ExpenseLimit, TotalExpenseLimit } from "@/types";
import { useToast } from "@/hooks/use-toast";

const ExpensesOverview = () => {
  const [totalLimit, setTotalLimit] = useState<TotalExpenseLimit | null>(null);
  const [categoryLimits, setCategoryLimits] = useState<ExpenseLimit[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [totalSpent, setTotalSpent] = useState(0);
  const { toast } = useToast();

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-primary";
  };

  const checkAndNotifyLimits = (spent: number, limit: number, category?: string) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) {
      toast({
        title: "Expense Limit Exceeded!",
        description: `${category ? category : 'Total'} expenses have exceeded the set limit`,
        variant: "destructive",
      });
    } else if (percentage >= 50) {
      toast({
        title: "Warning",
        description: `${category ? category : 'Total'} expenses have reached 50% of the limit`,
      });
    }
  };

  const fetchExpenseData = async () => {
    const start = new Date();
    start.setDate(1); // First day of current month
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // Last day of current month

    const { data: expenseData } = await supabase
      .from("expenses")
      .select("category, amount")
      .gte("date", start.toISOString())
      .lte("date", end.toISOString());

    if (expenseData) {
      const totals: Record<string, number> = {};
      let total = 0;

      expenseData.forEach((expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
        total += expense.amount;
      });

      setCategoryTotals(totals);
      setTotalSpent(total);

      // Check total limit
      if (totalLimit?.amount) {
        checkAndNotifyLimits(total, totalLimit.amount);
      }

      // Check category limits
      categoryLimits.forEach(limit => {
        const categorySpent = totals[limit.category] || 0;
        if (categorySpent > 0) {
          checkAndNotifyLimits(categorySpent, limit.amount, limit.category);
        }
      });
    }
  };

  // Effect to check limits on initial load
  useEffect(() => {
    if (totalLimit?.amount || categoryLimits.length > 0) {
      if (totalLimit?.amount) {
        checkAndNotifyLimits(totalSpent, totalLimit.amount);
      }
      
      categoryLimits.forEach(limit => {
        const categorySpent = categoryTotals[limit.category] || 0;
        if (categorySpent > 0) {
          checkAndNotifyLimits(categorySpent, limit.amount, limit.category);
        }
      });
    }
  }, [totalLimit, categoryLimits, totalSpent, categoryTotals]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch limits
      const [totalLimitRes, categoryLimitsRes] = await Promise.all([
        supabase.from("total_expense_limit").select("*").maybeSingle(),
        supabase.from("expense_limits").select("*"),
      ]);

      if (totalLimitRes.data) setTotalLimit(totalLimitRes.data);
      if (categoryLimitsRes.data) setCategoryLimits(categoryLimitsRes.data);

      await fetchExpenseData();
    };

    fetchData();

    // Subscribe to changes
    const expensesChannel = supabase
      .channel('expenses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses'
        },
        () => {
          fetchExpenseData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expense_limits'
        },
        async () => {
          const { data } = await supabase.from("expense_limits").select("*");
          if (data) setCategoryLimits(data);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'total_expense_limit'
        },
        async () => {
          const { data } = await supabase.from("total_expense_limit").select("*").maybeSingle();
          if (data) setTotalLimit(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(expensesChannel);
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className={`col-span-full bg-white`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Monthly Expenses</CardTitle>
          <span className="text-sm font-medium">
            ${totalSpent.toFixed(2)} / ${totalLimit?.amount?.toFixed(2) || "0.00"}
          </span>
        </CardHeader>
        <CardContent>
          <Progress 
            value={totalLimit?.amount ? (totalSpent / totalLimit.amount) * 100 : 0} 
            className={`h-2 ${totalLimit?.amount ? getProgressColor(totalSpent, totalLimit.amount) : ""}`}
          />
        </CardContent>
      </Card>

      {categoryLimits.map((limit) => {
        const categorySpent = categoryTotals[limit.category] || 0;
        return (
          <Card key={limit.id} className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{limit.category}</CardTitle>
              <span className="text-sm font-medium">
                ${categoryTotals[limit.category]?.toFixed(2) || "0.00"} / ${limit.amount.toFixed(2)}
              </span>
            </CardHeader>
            <CardContent>
              <Progress 
                value={limit.amount ? ((categoryTotals[limit.category] || 0) / limit.amount) * 100 : 0}
                className={`h-2 ${getProgressColor(categorySpent, limit.amount)}`}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ExpensesOverview;
