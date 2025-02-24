import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TwoFactorVerificationProps {
  email: string;
  password: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const TwoFactorVerification = ({
  email,
  password,
  onSuccess,
  onCancel,
}: TwoFactorVerificationProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const { toast } = useToast();

  const sendVerificationCode = async () => {
    setSendingCode(true);
    try {
      const { error } = await supabase.functions.invoke('send-2fa-code', {
        body: { email },
      });

      if (error) throw error;

      toast({
        title: "Code sent",
        description: "Please check your email for the verification code",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email_code, email_code_expires_at')
        .single();

      if (!profile?.email_code) {
        throw new Error('No verification code found');
      }

      if (new Date(profile.email_code_expires_at) < new Date()) {
        throw new Error('Verification code has expired');
      }

      if (code !== profile.email_code) {
        throw new Error('Invalid verification code');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      await supabase
        .from('profiles')
        .update({
          email_code: null,
          email_code_expires_at: null,
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Enter the verification code sent to your email
        </AlertDescription>
      </Alert>

      <Input
        type="text"
        placeholder="Enter verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
        className="text-center tracking-widest"
      />

      <div className="space-y-2">
        <Button
          onClick={verifyCode}
          disabled={loading || !code}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={sendVerificationCode}
          disabled={sendingCode}
          className="w-full"
        >
          {sendingCode ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending code...
            </>
          ) : (
            "Resend code"
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={onCancel}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TwoFactorVerification;