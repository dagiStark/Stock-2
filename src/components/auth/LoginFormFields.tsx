import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormFieldsProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

const LoginFormFields = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: LoginFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </div>
    </>
  );
};

export default LoginFormFields;