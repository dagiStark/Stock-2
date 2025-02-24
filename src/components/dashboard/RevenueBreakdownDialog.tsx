
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { pdf } from "@react-pdf/renderer";
import RevenueSummaryPDF from "./RevenueSummaryPDF";
import PeriodSelector from "./components/PeriodSelector";
import { PeriodType, getDateRange } from "./utils/dateUtils";
import { 
  generateMonthlyCSVContent, 
  generateDecadeCSVContent, 
  generateDetailedCSVContent 
} from "./utils/exportUtils";
import { DatabaseOrder } from "@/types/database";

interface RevenueBreakdownDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const RevenueBreakdownDialog = ({ isOpen, onClose }: RevenueBreakdownDialogProps) => {
  const { toast } = useToast();
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const calculateYearlyTotals = (orders: DatabaseOrder[]) => {
    const monthlyData = orders.reduce((acc, order) => {
      const month = new Date(order.created_at).getMonth();
      if (!acc[month]) {
        acc[month] = {
          totalOrders: 0,
          totalRevenue: 0,
        };
      }
      acc[month].totalOrders++;
      acc[month].totalRevenue += order.total_amount;
      return acc;
    }, {} as Record<number, { totalOrders: number; totalRevenue: number }>);

    const yearTotalOrders = Object.values(monthlyData).reduce((sum, data) => sum + data.totalOrders, 0);
    const yearTotalRevenue = Object.values(monthlyData).reduce((sum, data) => sum + data.totalRevenue, 0);

    return { yearTotalOrders, yearTotalRevenue, monthlyData };
  };

  const exportToCSV = async () => {
    try {
      setIsLoading(true);
      const { startDate, endDate } = getDateRange(periodType, selectedYear, selectedMonth, selectedQuarter);

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      let csvContent = "";
      
      if (periodType === 'year') {
        csvContent = generateMonthlyCSVContent(orders as DatabaseOrder[]);
      } else if (periodType === 'decade') {
        csvContent = generateDecadeCSVContent(orders as DatabaseOrder[]);
      } else {
        csvContent = generateDetailedCSVContent(orders as DatabaseOrder[]);
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `revenue_summary_${selectedYear}_${periodType}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Your revenue data has been exported to CSV",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setIsLoading(true);
      const { startDate, endDate } = getDateRange(periodType, selectedYear, selectedMonth, selectedQuarter);

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      const ordersData = orders as DatabaseOrder[];
      let totalRevenue = 0;
      let totalOrders = ordersData.length;

      if (periodType === 'year') {
        const { yearTotalRevenue, yearTotalOrders } = calculateYearlyTotals(ordersData);
        totalRevenue = yearTotalRevenue;
        totalOrders = yearTotalOrders;
      } else {
        totalRevenue = ordersData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      }

      const pdfContent = (
        <RevenueSummaryPDF
          periodType={periodType}
          startDate={startDate.toLocaleDateString()}
          endDate={endDate.toLocaleDateString()}
          orders={ordersData}
          totalRevenue={totalRevenue}
          totalOrders={totalOrders}
        />
      );

      const pdfDoc = await pdf(pdfContent).toBlob();
      const url = URL.createObjectURL(pdfDoc);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revenue_summary_${selectedYear}_${periodType}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Your revenue data has been exported to PDF",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Revenue Summary</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <PeriodSelector
            periodType={periodType}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedQuarter={selectedQuarter}
            setPeriodType={setPeriodType}
            setSelectedYear={setSelectedYear}
            setSelectedMonth={setSelectedMonth}
            setSelectedQuarter={setSelectedQuarter}
          />

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={isLoading}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              onClick={exportToPDF}
              disabled={isLoading}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>

          <div className="mt-6">
            <p className="text-muted-foreground text-center py-8">
              Select a period and export format to download the revenue summary
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RevenueBreakdownDialog;
