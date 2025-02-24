
import { Input } from "@/components/ui/input";

interface OrderItemInputProps {
  value: string | number;
  onChange?: (value: any) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  step?: string;
  readOnly?: boolean;
  className?: string;
}

const OrderItemInput = ({
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  min,
  step,
  readOnly,
  className
}: OrderItemInputProps) => {
  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`h-12 text-lg px-4 min-w-[150px] ${className}`}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      step={step}
      readOnly={readOnly}
    />
  );
};

export default OrderItemInput;
