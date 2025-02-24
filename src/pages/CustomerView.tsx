
import { useEffect, useState } from "react";
import { InventoryItem } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const CustomerView = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching items:', error);
          return;
        }

        const transformedItems: InventoryItem[] = data.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
          cost: Number(item.cost_price),
          status: determineStatus(item.quantity, item.yellow_threshold, item.red_threshold),
          image: item.image_url,
          itemsPerPackage: item.items_per_package,
          vendor: item.vendor,
          description: item.description,
          barcode: item.barcode,
          weight: 0,
          originalWeight: 0,
          originalUnit: 'kg',
          yellowThreshold: item.yellow_threshold || 50,
          redThreshold: item.red_threshold || 20
        }));

        setItems(transformedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const determineStatus = (quantity: number, yellowThreshold: number = 50, redThreshold: number = 20): 'green' | 'yellow' | 'red' => {
    if (quantity <= redThreshold) return 'red';
    if (quantity <= yellowThreshold) return 'yellow';
    return 'green';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Our Products</h1>
        {loading ? (
          <div className="text-center text-gray-600">Loading products...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-600">No products available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 mt-2">{item.description || 'No description available'}</p>
                  <p className="text-xl font-bold text-gray-900 mt-2">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerView;
