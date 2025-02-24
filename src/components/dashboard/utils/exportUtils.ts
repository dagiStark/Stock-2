import { DatabaseOrder } from "@/types/database";
import { calculateQuarterlyData, calculateDailyData } from "./revenueCalculations";

export const generateMonthlyCSVContent = (orders: DatabaseOrder[]) => {
  const dailyData = calculateDailyData(orders);
  const totalOrders = dailyData.reduce((sum, day) => sum + day.totalOrders, 0);
  const totalRevenue = dailyData.reduce((sum, day) => sum + day.totalRevenue, 0);

  return [
    ["Date", "Total Orders", "Total Revenue"].join(","),
    ...dailyData.map(day => [
      day.date,
      day.totalOrders,
      day.totalRevenue.toFixed(2)
    ].join(",")),
    [], // Empty line before summary
    ["Total Orders for Month", totalOrders].join(","),
    ["Total Revenue for Month", totalRevenue.toFixed(2)].join(",")
  ].join("\n");
};

export const generateDecadeCSVContent = (orders: DatabaseOrder[]) => {
  const yearlyData = orders.reduce((acc, order) => {
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
  }, {} as Record<number, { totalOrders: number; totalRevenue: number }>);

  return [
    ["Year", "Total Orders", "Total Revenue"].join(","),
    ...Object.entries(yearlyData).map(([year, data]) => [
      year,
      data.totalOrders,
      data.totalRevenue.toFixed(2)
    ].join(",")),
    [], // Empty line before summary
    ["Total Orders", orders.length].join(","),
    ["Total Revenue", orders.reduce((sum, order) => sum + (order.total_amount || 0), 0).toFixed(2)].join(",")
  ].join("\n");
};

export const generateDetailedCSVContent = (orders: DatabaseOrder[]) => {
  if (orders.length === 0) {
    return ["Date", "Order ID", "Customer", "Total Amount", "Payment Status"].join(",");
  }

  const period = Math.floor(new Date(orders[0].created_at).getMonth() / 3);
  const quarterData = calculateQuarterlyData(orders);

  return [
    ["Month", "Total Orders", "Total Revenue"].join(","),
    ...quarterData.months.map(month => {
      const monthData = quarterData.monthlyData[month];
      return [
        month,
        monthData?.totalOrders || 0,
        (monthData?.totalRevenue || 0).toFixed(2)
      ].join(",");
    }),
    [], // Empty line before summary
    ["Quarter", quarterData.quarter].join(","),
    ["Total Orders", quarterData.totalOrders].join(","),
    ["Total Revenue", quarterData.totalRevenue.toFixed(2)].join(",")
  ].join("\n");
};
