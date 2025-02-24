import { DatabaseOrder } from "@/types/database";

export interface PeriodData {
  totalOrders: number;
  totalRevenue: number;
}

export interface QuarterData {
  quarter: number;
  months: string[];
  totalOrders: number;
  totalRevenue: number;
  monthlyData: Record<string, PeriodData>;
}

export interface DailyData {
  date: string;
  totalOrders: number;
  totalRevenue: number;
}

export const calculateYearlyData = (orders: DatabaseOrder[]) => {
  return orders.reduce((acc, order) => {
    const year = new Date(order.created_at).getFullYear();
    if (!acc[year]) {
      acc[year] = {
        totalOrders: 0,
        totalRevenue: 0,
      };
    }
    acc[year].totalOrders++;
    acc[year].totalRevenue += order.total_amount;
    return acc;
  }, {} as Record<number, PeriodData>);
};

export const calculateMonthlyData = (orders: DatabaseOrder[]) => {
  return orders.reduce((acc, order) => {
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
  }, {} as Record<number, PeriodData>);
};

export const calculateQuarterlyData = (orders: DatabaseOrder[]): QuarterData => {
  const monthlyData = orders.reduce((acc, order) => {
    const date = new Date(order.created_at);
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    
    if (!acc[monthName]) {
      acc[monthName] = {
        totalOrders: 0,
        totalRevenue: 0,
      };
    }
    
    acc[monthName].totalOrders++;
    acc[monthName].totalRevenue += order.total_amount;
    return acc;
  }, {} as Record<string, PeriodData>);

  const quarter = Math.floor(new Date(orders[0]?.created_at || new Date()).getMonth() / 3);
  const quarterMonths = monthNames.slice(quarter * 3, (quarter + 1) * 3);
  
  const totalOrders = Object.values(monthlyData).reduce((sum, data) => sum + data.totalOrders, 0);
  const totalRevenue = Object.values(monthlyData).reduce((sum, data) => sum + data.totalRevenue, 0);

  return {
    quarter: quarter + 1,
    months: quarterMonths,
    totalOrders,
    totalRevenue,
    monthlyData
  };
};

export const calculateDailyData = (orders: DatabaseOrder[]): DailyData[] => {
  const dailyData = orders.reduce((acc, order) => {
    const date = new Date(order.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        date,
        totalOrders: 0,
        totalRevenue: 0,
      };
    }
    acc[date].totalOrders++;
    acc[date].totalRevenue += order.total_amount;
    return acc;
  }, {} as Record<string, DailyData>);

  return Object.values(dailyData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
