import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EnableTwoFactorProps {
  onSuccess: (backupCodes: string[]) => void;
}

const EnableTwoFactor = ({ onSuccess }: EnableTwoFactorProps) => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [token, setToken] = useState("");
  const { toast } = useToast();

  const enableTwoFactor = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase.functions.invoke('generate-2fa-secret', {
        body: { email: user.email }
      });
      
      if (error) throw error;
      
      const { secret: newSecret, otpauth_url } = data;
      setSecret(newSecret);

      // Convert otpauth URL to QR code URL using QR code generator service
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth_url)}`;
      setQrCodeUrl(qrUrl);

      await supabase
        .from("profiles")
        .update({
          two_factor_status: "pending",
          two_factor_secret: newSecret,
        })
        .eq("id", user.id);

      toast({
        title: "2FA Setup Started",
        description: "Please scan the QR code with your authenticator app.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to enable 2FA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    setVerifying(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase.functions.invoke('verify-2fa-token', {
        body: { token, secret }
      });

      if (error || !data.valid) {
        throw new Error("Invalid token");
      }

      const { data: backupCodesData, error: backupError } = await supabase.rpc('generate_backup_codes');
      if (backupError) throw backupError;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          two_factor_status: "enabled",
          two_factor_confirmed: true,
          backup_codes: backupCodesData
        })
        .eq("id", user.id);

      if (updateError) throw updateError;
      onSuccess(backupCodesData);

      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify token",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
      setToken("");
    }
  };

  return (
    <div className="space-y-4">
      {!qrCodeUrl ? (
        <Button
          onClick={enableTwoFactor}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enabling 2FA...
            </>
          ) : (
            "Enable 2FA"
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              1. Scan this QR code with your authenticator app (like Google Authenticator)
              <br />
              2. Enter the 6-digit code from your app below to verify
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center">
            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={6}
            />
            <Button
              onClick={verifyToken}
              disabled={verifying || token.length !== 6}
              className="w-full"
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnableTwoFactor;