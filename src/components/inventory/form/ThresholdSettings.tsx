
import FormField from "./FormField";

interface ThresholdSettingsProps {
  yellowThreshold: number;
  redThreshold: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ThresholdSettings = ({
  yellowThreshold,
  redThreshold,
  onChange
}: ThresholdSettingsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Warning Threshold"
        id="yellowThreshold"
        name="yellowThreshold"
        type="number"
        value={yellowThreshold}
        onChange={onChange}
        min="0"
        required
        helperText="Show warning when stock falls below this amount"
      />
      
      <FormField
        label="Critical Threshold"
        id="redThreshold"
        name="redThreshold"
        type="number"
        value={redThreshold}
        onChange={onChange}
        min="0"
        required
        helperText="Mark as low stock when quantity falls below this amount"
      />
    </div>
  );
};

export default ThresholdSettings;
