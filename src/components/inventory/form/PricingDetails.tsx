import FormField from "./FormField";

interface PricingDetailsProps {
  cost: number;
  price: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PricingDetails = ({ cost, price, onChange }: PricingDetailsProps) => {
  return (
    <>
      <FormField
        label="Cost Price ($)"
        id="cost"
        name="cost"
        type="number"
        min="0"
        step="0.01"
        value={cost}
        onChange={onChange}
        required
      />
      
      <FormField
        label="Selling Price ($)"
        id="price"
        name="price"
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={onChange}
        required
      />
    </>
  );
};

export default PricingDetails;