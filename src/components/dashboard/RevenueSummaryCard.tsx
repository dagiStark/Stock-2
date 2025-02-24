
import React from 'react';
import { DatabaseOrder } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import RevenueSummaryPDF from './RevenueSummaryPDF';

type PeriodType = 'monthly' | 'quarterly' | 'yearly' | 'decade';

interface RevenueSummaryCardProps {
  data: {
    period_start: string;
    period_end: string;
    total_revenue: number;
    total_cost: number;
    net_profit: number;
    orders: DatabaseOrder[];
  }[];
  period: PeriodType;
}

const RevenueSummaryCard: React.FC<RevenueSummaryCardProps> = ({ data, period }) => {
  // Transform the data to match RevenueSummaryPDF props
  const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);
  const startDate = data[0]?.period_start || '';
  const endDate = data[data.length - 1]?.period_end || '';
  const orders = data.flatMap(item => item.orders);
  const totalOrders = orders.length;

  return (
    <Card className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Revenue Summary</h3>
          <p className="text-sm text-muted-foreground">View detailed revenue reports</p>
        </div>
      </div>

      <div className="flex justify-end">
        {data.length > 0 && (
          <PDFDownloadLink
            document={
              <RevenueSummaryPDF
                periodType={period}
                startDate={startDate}
                endDate={endDate}
                orders={orders}
                totalRevenue={totalRevenue}
                totalOrders={totalOrders}
              />
            }
            fileName={`revenue-summary-${period}.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading}>
                <FileDown className="w-4 h-4 mr-2" />
                {loading ? "Generating..." : "Download Report"}
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </div>
    </Card>
  );
};

export default RevenueSummaryCard;
