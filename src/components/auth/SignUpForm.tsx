import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TwoFactorVerification from "./TwoFactorVerification";
import SignUpFormFields from "./SignUpFormFields";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create the user but don't sign them in yet
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        // Handle specific error cases
        if (signUpError.message.includes('User already registered')) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
          return;
        }
        throw signUpError;
      }

      // Show verification screen and trigger code sending
      setShowVerification(true);

      // Send verification code
      const { error: codeError } = await supabase.functions.invoke('send-2fa-code', {
        body: { email },
      });

      if (codeError) throw codeError;

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

  const handleVerificationSuccess = () => {
    toast({
      title: "Success",
      description: "Your account has been verified. You can now sign in.",
    });
    // Refresh the page to show the login form
    window.location.reload();
  };

  if (showVerification) {
    return (
      <TwoFactorVerification
        email={email}
        password={password}
        onSuccess={handleVerificationSuccess}
        onCancel={() => setShowVerification(false)}
      />
    );
  }

  return (
    <SignUpFormFields
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      loading={loading}
      onSubmit={handleSignUp}
    />
  );
};

export default SignUpForm;