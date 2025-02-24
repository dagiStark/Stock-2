import FormField from "./FormField";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BasicItemDetailsProps {
  name: string;
  barcode: string;
  vendor: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicItemDetails = ({ name, barcode, vendor, description, onChange }: BasicItemDetailsProps) => {
  return (
    <>
      <FormField
        label="Item Name"
        id="name"
        name="name"
        value={name}
        onChange={onChange}
        required
      />
      
      <FormField
        label="Barcode"
        id="barcode"
        name="barcode"
        value={barcode}
        onChange={onChange}
        placeholder="Enter item barcode"
      />
      
      <FormField
        label="Vendor"
        id="vendor"
        name="vendor"
        value={vendor}
        onChange={onChange}
        placeholder="Enter vendor name"
      />

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Enter item description"
          className="min-h-[100px]"
        />
      </div>
    </>
  );
};

export default BasicItemDetails;