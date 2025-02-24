import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DisableTwoFactorProps {
  onDisabled: () => void;
}

const DisableTwoFactor = ({ onDisabled }: DisableTwoFactorProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const disableTwoFactor = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      await supabase
        .from("profiles")
        .update({
          two_factor_status: "disabled",
          email_code: null,
          email_code_expires_at: null
        })
        .eq("id", user.id);

      onDisabled();
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to disable 2FA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={disableTwoFactor}
      disabled={loading}
      variant="destructive"
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Disabling 2FA...
        </>
      ) : (
        "Disable 2FA"
      )}
    </Button>
  );
};

export default DisableTwoFactor;