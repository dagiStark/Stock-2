import { Alert, AlertDescription } from "@/components/ui/alert";

interface BackupCodesProps {
  codes: string[];
}

const BackupCodes = ({ codes }: BackupCodesProps) => {
  if (!codes.length) return null;

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Two-factor authentication is enabled. Keep your backup codes safe!
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <h3 className="font-medium">Backup Codes</h3>
        <div className="grid grid-cols-2 gap-2">
          {codes.map((code, index) => (
            <code key={index} className="p-2 bg-muted rounded">
              {code}
            </code>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Save these codes in a secure place. You can use them to log in if you lose access to your authenticator app.
        </p>
      </div>
    </div>
  );
};

export default BackupCodes;