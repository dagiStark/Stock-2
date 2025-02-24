
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExpenseLimit, TotalExpenseLimit } from "@/types";

interface ExpenseLimitsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExpenseLimitsDialog = ({ open, onOpenChange }: ExpenseLimitsDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [totalLimit, setTotalLimit] = useState<TotalExpenseLimit | null>(null);
  const [categoryLimits, setCategoryLimits] = useState<ExpenseLimit[]>([]);

  useEffect(() => {
    const fetchLimits = async () => {
      const [totalLimitRes, categoryLimitsRes] = await Promise.all([
        supabase.from("total_expense_limit").select("*").maybeSingle(),
        supabase.from("expense_limits").select("*"),
      ]);

      if (totalLimitRes.data) {
        setTotalLimit(totalLimitRes.data);
      }

      if (categoryLimitsRes.data) {
        setCategoryLimits(categoryLimitsRes.data);
      }
    };

    if (open) {
      fetchLimits();
    }
  }, [open]);

  const handleUpdateTotalLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(totalLimit?.amount?.toString() || "0");
      
      if (!totalLimit?.id) {
        // Insert new total limit if none exists
        const { data, error } = await supabase
          .from("total_expense_limit")
          .insert({ amount })
          .select()
          .single();

        if (error) throw error;
        setTotalLimit(data);
      } else {
        // Update existing total limit
        const { error } = await supabase
          .from("total_expense_limit")
          .update({ amount })
          .eq("id", totalLimit.id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Total limit updated successfully",
      });
    } catch (error) {
      console.error("Error updating total limit:", error);
      toast({
        title: "Error",
        description: "Failed to update total limit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategoryLimit = async (limit: ExpenseLimit, newAmount: number) => {
    try {
      const { error } = await supabase
        .from("expense_limits")
        .update({ amount: newAmount })
        .eq("id", limit.id);

      if (error) throw error;

      setCategoryLimits(prevLimits =>
        prevLimits.map(l => l.id === limit.id ? { ...l, amount: newAmount } : l)
      );

      toast({
        title: "Success",
        description: "Category limit updated successfully",
      });
    } catch (error) {
      console.error("Error updating category limit:", error);
      toast({
        title: "Error",
        description: "Failed to update category limit",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Expense Limits</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <form onSubmit={handleUpdateTotalLimit} className="space-y-4">
            <div>
              <Label htmlFor="totalLimit">Total Monthly Limit</Label>
              <div className="flex gap-4">
                <Input
                  id="totalLimit"
                  type="number"
                  step="0.01"
                  value={totalLimit?.amount || ""}
                  onChange={(e) =>
                    setTotalLimit((prev) => ({
                      ...(prev || { id: "", created_at: "", updated_at: "" }),
                      amount: parseFloat(e.target.value) || 0
                    }))
                  }
                />
                <Button type="submit" disabled={loading}>
                  Update
                </Button>
              </div>
            </div>
          </form>

          <div className="space-y-4">
            <Label>Category Limits</Label>
            {categoryLimits.map((limit) => (
              <div key={limit.id} className="flex gap-4 items-center">
                <span className="w-1/3">{limit.category}</span>
                <Input
                  type="number"
                  step="0.01"
                  value={limit.amount}
                  onChange={(e) => handleUpdateCategoryLimit(limit, parseFloat(e.target.value))}
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseLimitsDialog;
