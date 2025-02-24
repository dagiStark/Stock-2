import { supabase } from "@/integrations/supabase/client";

interface ExistingVendor {
  id: string;
  name: string;
}

export const useVendorValidation = () => {
  const checkExistingVendor = async (phone: string): Promise<ExistingVendor | false> => {
    if (!phone) return false;
    
    const { data, error } = await supabase
      .from('vendors')
      .select('id, name')
      .eq('phone', phone);

    if (error) {
      console.error('Error checking existing vendor:', error);
      return false;
    }

    return data && data.length > 0 ? data[0] : false;
  };

  return {
    checkExistingVendor,
  };
};