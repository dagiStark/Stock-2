import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderInfoProps {
  orderInfo: {
    salesperson: string;
    shipVia: string;
    location: string;
    terms: string;
    taxNumber: string;
  };
  onChange: (field: string, value: string) => void;
}

export const OrderInfoSection = ({ orderInfo, onChange }: OrderInfoProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div>
        <Label>Purchase Order No.</Label>
        <Input value={`PO${Math.floor(Math.random() * 1000000)}`} readOnly className="rounded-none" />
      </div>
      <div>
        <Label>Order Date</Label>
        <Input value={new Date().toLocaleDateString()} readOnly className="rounded-none" />
      </div>
      <div>
        <Label>Salesperson</Label>
        <Input
          value={orderInfo.salesperson}
          onChange={(e) => onChange("salesperson", e.target.value)}
          className="rounded-none"
        />
      </div>
      <div>
        <Label>Ship Via</Label>
        <Input
          value={orderInfo.shipVia}
          onChange={(e) => onChange("shipVia", e.target.value)}
          className="rounded-none"
        />
      </div>
      <div>
        <Label>Location</Label>
        <Input
          value={orderInfo.location}
          onChange={(e) => onChange("location", e.target.value)}
          className="rounded-none"
        />
      </div>
      <div>
        <Label>Terms</Label>
        <Input
          value={orderInfo.terms}
          onChange={(e) => onChange("terms", e.target.value)}
          placeholder="C.O.D."
          className="rounded-none"
        />
      </div>
      <div>
        <Label>Tax Number</Label>
        <Input
          value={orderInfo.taxNumber}
          onChange={(e) => onChange("taxNumber", e.target.value)}
          className="rounded-none"
        />
      </div>
      <div>
        <Label>Page</Label>
        <Input value="1" readOnly className="rounded-none" />
      </div>
    </div>
  );
};