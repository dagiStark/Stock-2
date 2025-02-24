
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ItemStatistics = () => {
  const navigate = useNavigate();
  const days_window = 30;
  const frequency_threshold = 10; // Consider an item frequent if it sells 10 units in 30 days

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['itemFrequencyStatus', days_window, frequency_threshold],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_item_frequency_status', { 
          days_window,
          frequency_threshold
        });
      
      if (error) {
        console.error('Error fetching frequency status:', error);
        throw error;
      }
      return data;
    }
  });

  const handleEditItem = (itemId: string) => {
    navigate('/inventory');
  };

  const frequentItems = salesData?.filter(item => item.total_quantity > 0)
    .sort((a, b) => Number(b.average_daily_sales) - Number(a.average_daily_sales))
    .slice(0, 5) || [];

  if (isLoading) {
    return <div>Loading sales statistics...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">
          Top Selling Items (Last {days_window} Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {frequentItems.length === 0 ? (
          <div className="text-center py-6 md:py-8 text-muted-foreground text-sm md:text-base">
            No sales data available for the last {days_window} days
          </div>
        ) : (
          <div className="space-y-4">
            {frequentItems.map((item) => (
              <div
                key={item.item_id}
                className={`flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${
                  item.is_frequent ? 'border-green-500/50' : ''
                }`}
              >
                <div>
                  <h3 className="font-medium">{item.item_name}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Total: {item.total_quantity} units sold
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Average: {item.average_daily_sales} units/day
                      {item.is_frequent && (
                        <span className="ml-2 text-green-600 font-medium">
                          (Frequently Sold)
                        </span>
                      )}
                    </p>
                    {item.last_sold && (
                      <p className="text-sm text-muted-foreground">
                        Last sold: {new Date(item.last_sold).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditItem(item.item_id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemStatistics;

