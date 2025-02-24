import { supabase } from "@/integrations/supabase/client";

interface ExistingCustomer {
  id: string;
  name: string;
}

export const useCustomerValidation = () => {
  const checkExistingCustomer = async (phone: string): Promise<ExistingCustomer | false> => {
    if (!phone) return false;
    
    const { data, error } = await supabase
      .from('customers')
      .select('id, name')
      .eq('phone', phone);

    if (error) {
      console.error('Error checking existing customer:', error);
      return false;
    }

    return data && data.length > 0 ? data[0] : false;
  };

  return {
    checkExistingCustomer,
  };
};