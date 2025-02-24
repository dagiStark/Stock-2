import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import EnableTwoFactor from "./EnableTwoFactor";
import BackupCodes from "./BackupCodes";
import DisableTwoFactor from "./DisableTwoFactor";
import type { TwoFactorStatus } from "@/types/auth";

const TwoFactorSettings = () => {
  const [status, setStatus] = useState<TwoFactorStatus>("disabled");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  useEffect(() => {
    fetchTwoFactorStatus();
  }, []);

  const fetchTwoFactorStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("two_factor_status, backup_codes")
        .eq("id", user.id)
        .single();

      if (profile) {
        setStatus(profile.two_factor_status as TwoFactorStatus);
        if (profile.backup_codes) {
          setBackupCodes(profile.backup_codes);
        }
      }
    } catch (error) {
      console.error("Error fetching 2FA status:", error);
    }
  };

  const handleSuccess = (codes: string[]) => {
    setStatus("enabled");
    setBackupCodes(codes);
  };

  const handleDisabled = () => {
    setStatus("disabled");
    setBackupCodes([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
        <CardDescription>
          Enhance your account security by enabling two-factor authentication via email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {status === "disabled" && (
          <EnableTwoFactor onSuccess={handleSuccess} />
        )}

        {status === "pending" && (
          <EnableTwoFactor onSuccess={handleSuccess} />
        )}

        {(status === "enabled" || status === "email") && (
          <div className="space-y-4">
            <BackupCodes codes={backupCodes} />
            <DisableTwoFactor onDisabled={handleDisabled} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSettings;