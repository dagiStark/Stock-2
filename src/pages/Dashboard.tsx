
import { Package, ShoppingCart, AlertTriangle, LineChart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ItemStatistics from "@/components/dashboard/ItemStatistics";
import { useEffect, useState } from "react";
import { InventoryItem, Order } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import RevenueBreakdownDialog from "@/components/dashboard/RevenueBreakdownDialog";

interface RevenueSummaryStats {
  totalItems: number;
  totalOrders: number;
  lowStockItems: number;
  monthlyRevenue: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showRevenueBreakdown, setShowRevenueBreakdown] = useState(false);
  const [stats, setStats] = useState<RevenueSummaryStats>({
    totalItems: 0,
    totalOrders: 0,
    lowStockItems: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    const inventoryItems: InventoryItem[] = JSON.parse(localStorage.getItem("inventoryItems") || "[]");
    const orders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
    const lowStockCount = inventoryItems.filter(item => item.status === 'red').length;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthlyRevenue = orders.reduce((total, order) => {
      const orderDate = new Date(order.date);
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        return total + order.total;
      }
      return total;
    }, 0);

    setStats({
      totalItems: inventoryItems.length,
      totalOrders: orders.length,
      lowStockItems: lowStockCount,
      monthlyRevenue: monthlyRevenue,
    });
  }, []);

  const handleTotalItemsClick = () => {
    navigate('/inventory');
  };

  const handleTotalOrdersClick = () => {
    navigate('/orders');
  };

  const handleLowStockClick = () => {
    navigate('/inventory');
    localStorage.setItem('inventoryFilter', 'red');
    toast({
      title: "Filter Applied",
      description: "Showing low stock items only",
    });
  };

  const handleMonthlyRevenueClick = () => {
    setShowRevenueBreakdown(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome to your inventory management system.</p>
          </div>
          <Button 
            onClick={() => window.open('/customer-view', '_blank')}
            variant="outline"
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Customer Page
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Items"
          value={stats.totalItems}
          icon={Package}
          iconClassName="bg-blue-50 text-blue-600"
          onClick={handleTotalItemsClick}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          iconClassName="bg-green-50 text-green-600"
          onClick={handleTotalOrdersClick}
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          iconClassName="bg-red-50 text-red-600"
          onClick={handleLowStockClick}
        />
        <StatsCard
          title="Revenue Summary"
          value={`$${stats.monthlyRevenue.toFixed(2)}`}
          icon={LineChart}
          iconClassName="bg-purple-50 text-purple-600"
          onClick={handleMonthlyRevenueClick}
        />
      </div>

      <RevenueBreakdownDialog 
        isOpen={showRevenueBreakdown} 
        onClose={() => setShowRevenueBreakdown(false)} 
      />

      <RecentActivity />
      
      <div className="space-y-8">
        <ItemStatistics />
      </div>
    </div>
  );
};

export default Dashboard;
