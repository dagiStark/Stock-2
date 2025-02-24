import React from "react";
import { AddressBlock } from "./AddressBlock";

interface Address {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
}

interface AddressSectionProps {
  billingAddress: Address;
  shippingAddress: Address;
  onBillingChange: (field: string, value: string) => void;
  onShippingChange: (field: string, value: string) => void;
}

export const AddressSection = ({
  billingAddress,
  shippingAddress,
  onBillingChange,
  onShippingChange,
}: AddressSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6">
      <AddressBlock
        title="Sold To"
        address={billingAddress}
        onChange={onBillingChange}
      />
      <AddressBlock
        title="Ship To"
        address={shippingAddress}
        onChange={onShippingChange}
      />
    </div>
  );
};