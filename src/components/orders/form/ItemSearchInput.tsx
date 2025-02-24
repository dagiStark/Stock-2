
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ItemSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onItemSelect: (item: { 
    id: string; 
    name: string; 
    price: number;
    description?: string;
    barcode?: string;
    weight?: number;
  }) => void;
}

const ItemSearchInput = ({ value, onChange, onItemSelect }: ItemSearchInputProps) => {
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    name: string;
    price: number;
    description?: string;
    barcode?: string;
    weight?: number;
  }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    const searchItems = async () => {
      if (!value) {
        setSearchResults([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('items')
          .select('id, name, price, description, barcode, weight')
          .or(`name.ilike.%${value}%, barcode.eq.${value}`)
          .limit(5);

        if (error) {
          console.error('Error searching items:', error);
          return;
        }

        if (data) {
          setSearchResults(data);
          
          // Only show toast if user has typed something and no results found
          if (data.length === 0 && value.length > 2) {
            toast({
              title: "No items found",
              description: "Try a different search term",
              variant: "destructive",
            });
          }
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(searchItems, 300);
    return () => clearTimeout(timeoutId);
  }, [value, toast]);

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type to search items by name or scan barcode..."
        className="h-12 text-lg px-4"
      />
      {searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
          {searchResults.map((item) => (
            <button
              key={item.id}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                onItemSelect(item);
                setSearchResults([]);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemSearchInput;
