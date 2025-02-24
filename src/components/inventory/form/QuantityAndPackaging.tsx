
import FormField from "./FormField";
import { Label } from "@/components/ui/label";
import WeightInput, { WeightUnit } from "../WeightInput";

interface QuantityAndPackagingProps {
  quantity: number;
  itemsPerPackage: number;
  weight: number;
  weightUnit: WeightUnit;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWeightChange: (weight: number) => void;
  onUnitChange: (unit: WeightUnit) => void;
}

const QuantityAndPackaging = ({
  quantity,
  itemsPerPackage,
  weight,
  weightUnit,
  onChange,
  onWeightChange,
  onUnitChange
}: QuantityAndPackagingProps) => {
  return (
    <>
      <FormField
        label="Quantity"
        id="quantity"
        name="quantity"
        type="number"
        min="0"
        value={quantity}
        onChange={onChange}
        required
      />
      
      <FormField
        label="Items per Package"
        id="itemsPerPackage"
        name="itemsPerPackage"
        type="number"
        min="1"
        value={itemsPerPackage}
        onChange={onChange}
        required
      />

      <div className="space-y-2">
        <Label htmlFor="weight">Weight per Item</Label>
        <WeightInput
          weight={weight}
          unit={weightUnit}
          onWeightChange={onWeightChange}
          onUnitChange={onUnitChange}
        />
      </div>
    </>
  );
};

export default QuantityAndPackaging;
