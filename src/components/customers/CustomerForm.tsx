
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  fax: string;
  description: string;
}

interface CustomerFormProps {
  formData: CustomerFormData;
  loading: boolean;
  onCancel: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CustomerForm = ({
  formData,
  loading,
  onCancel,
  onChange,
  onSubmit,
}: CustomerFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Customer Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fax">Fax</Label>
        <Input
          id="fax"
          name="fax"
          value={formData.fax}
          onChange={onChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          Add Customer
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
