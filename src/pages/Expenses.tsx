
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ExpensesList from "@/components/expenses/ExpensesList";
import AddExpenseDialog from "@/components/expenses/AddExpenseDialog";
import ExpenseLimitsDialog from "@/components/expenses/ExpenseLimitsDialog";
import ExpensesOverview from "@/components/expenses/ExpensesOverview";

const Expenses = () => {
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [limitsDialogOpen, setLimitsDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your expenses and spending limits.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setLimitsDialogOpen(true)}>
            Manage Limits
          </Button>
          <Button onClick={() => setAddExpenseOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      <ExpensesOverview />
      <ExpensesList />
      <AddExpenseDialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen} />
      <ExpenseLimitsDialog open={limitsDialogOpen} onOpenChange={setLimitsDialogOpen} />
    </div>
  );
};

export default Expenses;
