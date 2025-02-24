
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: string;
  step?: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

const FormField = ({ 
  label, 
  id, 
  name, 
  value, 
  onChange, 
  type = "text",
  min,
  step,
  required,
  placeholder,
  helperText
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        min={min}
        step={step}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default FormField;
