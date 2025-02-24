
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { WeightUnit } from "./WeightInput";
import ImageUpload from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types";
import BasicItemDetails from "./form/BasicItemDetails";
import QuantityAndPackaging from "./form/QuantityAndPackaging";
import PricingDetails from "./form/PricingDetails";
import ThresholdSettings from "./form/ThresholdSettings";

interface InventoryItemFormProps {
  initialData?: Partial<InventoryItem>;
  onSubmit: (data: Partial<InventoryItem>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const InventoryItemForm = ({ initialData, onSubmit, onCancel, loading }: InventoryItemFormProps) => {
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || "");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(initialData?.originalUnit || 'lb');
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    quantity: initialData?.quantity || 0,
    price: initialData?.price || 0,
    cost: initialData?.cost || 0,
    weight: initialData?.originalWeight || 0,
    itemsPerPackage: initialData?.itemsPerPackage || 1,
    vendor: initialData?.vendor || "",
    description: initialData?.description || "",
    barcode: initialData?.barcode || "",
    yellowThreshold: initialData?.yellowThreshold || 50,
    redThreshold: initialData?.redThreshold || 20
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'vendor' || name === 'description' || name === 'barcode' 
        ? value 
        : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let status: 'green' | 'yellow' | 'red' = 'green';
    if (formData.quantity <= formData.redThreshold) {
      status = 'red';
    } else if (formData.quantity <= formData.yellowThreshold) {
      status = 'yellow';
    }

    onSubmit({
      ...formData,
      status,
      weight: formData.weight,
      originalWeight: formData.weight,
      originalUnit: weightUnit,
      image: imagePreview || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicItemDetails
        name={formData.name}
        barcode={formData.barcode}
        vendor={formData.vendor}
        description={formData.description}
        onChange={handleInputChange}
      />

      <QuantityAndPackaging
        quantity={formData.quantity}
        itemsPerPackage={formData.itemsPerPackage}
        weight={formData.weight}
        weightUnit={weightUnit}
        onChange={handleInputChange}
        onWeightChange={(weight) => setFormData(prev => ({ ...prev, weight }))}
        onUnitChange={setWeightUnit}
      />

      <ThresholdSettings
        yellowThreshold={formData.yellowThreshold}
        redThreshold={formData.redThreshold}
        onChange={handleInputChange}
      />

      <PricingDetails
        cost={formData.cost}
        price={formData.price}
        onChange={handleInputChange}
      />

      <div className="space-y-2">
        <Label>Image</Label>
        <ImageUpload
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {initialData ? 'Save Changes' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryItemForm;
