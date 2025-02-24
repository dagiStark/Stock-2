import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TwoFactorVerification from "./TwoFactorVerification";
import LoginFormFields from "./LoginFormFields";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast({
            title: "Login failed",
            description: "Incorrect email or password. Please try again.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (!user) throw new Error("Invalid credentials");

      const { data: profile } = await supabase
        .from("profiles")
        .select("two_factor_status")
        .eq("id", user.id)
        .single();

      if (profile?.two_factor_status === "email") {
        await supabase.auth.signOut();
        setShowTwoFactor(true);
        
        const { error: codeError } = await supabase.functions.invoke('send-2fa-code', {
          body: { email },
        });

        if (codeError) throw codeError;

        toast({
          title: "Verification required",
          description: "Please check your email for the verification code",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      });
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

  if (showTwoFactor) {
    return (
      <TwoFactorVerification
        email={email}
        password={password}
        onSuccess={() => {
          toast({
            title: "Success",
            description: "Logged in successfully",
          });
        }}
        onCancel={() => setShowTwoFactor(false)}
      />
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      className="space-y-4"
    >
      <LoginFormFields
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;