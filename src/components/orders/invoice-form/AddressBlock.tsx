import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressBlockProps {
  title: string;
  address: {
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

export const AddressBlock = ({ title, address, onChange }: AddressBlockProps) => (
  <div className="space-y-2">
    <h3 className="font-semibold mb-2">{title}</h3>
    <div className="space-y-2">
      <div>
        <Label htmlFor={`${title}-name`}>Name</Label>
        <Input
          id={`${title}-name`}
          value={address.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="rounded-none"
        />
      </div>
      <div>
        <Label htmlFor={`${title}-address`}>Address</Label>
        <Input
          id={`${title}-address`}
          value={address.address}
          onChange={(e) => onChange("address", e.target.value)}
          className="rounded-none"
        />
      </div>
      <div>
        <Label htmlFor={`${title}-city`}>City</Label>
        <Input
          id={`${title}-city`}
          value={address.city}
          onChange={(e) => onChange("city", e.target.value)}
          className="rounded-none"
        />
      </div>
      <div>
        <Label htmlFor={`${title}-country`}>Country</Label>
        <Input
          id={`${title}-country`}
          value={address.country}
          onChange={(e) => onChange("country", e.target.value)}
          className="rounded-none"
        />
      </div>
      <div>
        <Label htmlFor={`${title}-phone`}>Phone</Label>
        <Input
          id={`${title}-phone`}
          value={address.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className="rounded-none"
        />
      </div>
    </div>
  </div>
);