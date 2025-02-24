
import { WeightUnit } from "@/components/inventory/WeightInput";

export const convertToPounds = (value: number, unit: WeightUnit): number => {
  switch (unit) {
    case 'kg':
      return value * 2.20462;
    case 'g':
      return value * 0.00220462;
    case 'oz':
      return value * 0.0625; // 1 oz = 0.0625 lb
    default:
      return value; // Already in pounds
  }
};
