import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';

interface WeightInputProps {
  weight: number;
  unit: WeightUnit;
  onWeightChange: (weight: number) => void;
  onUnitChange: (unit: WeightUnit) => void;
}

const WeightInput = ({ weight, unit, onWeightChange, onUnitChange }: WeightInputProps) => {
  return (
    <div className="flex gap-2">
      <Input
        id="weight"
        name="weight"
        type="number"
        min="0"
        step="0.01"
        value={weight}
        onChange={(e) => onWeightChange(Number(e.target.value))}
        className="flex-1"
        required
      />
      <Select value={unit} onValueChange={onUnitChange}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="lb">lb</SelectItem>
          <SelectItem value="kg">kg</SelectItem>
          <SelectItem value="g">g</SelectItem>
          <SelectItem value="oz">oz</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default WeightInput;