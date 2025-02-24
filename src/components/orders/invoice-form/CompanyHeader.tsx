import React from "react";
import { Text } from "@/components/ui/text";

export const CompanyHeader = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6 p-4 border-b">
      <div className="text-sm space-y-1">
        <Text className="font-bold">AGT Foods</Text>
        <Text>2185 Francis Hugues</Text>
        <Text>Laval, QC H7S 1N5</Text>
        <Text>Canada</Text>
        <Text>Phone: (450) 669-2663</Text>
        <Text>Fax: (450) 667-6799</Text>
      </div>
      <div className="flex items-center justify-center">
        <Text className="text-2xl font-bold">Facture / Invoice</Text>
      </div>
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <Text className="font-semibold">Invoice #:</Text>
          <Text>{`IN${Math.floor(Math.random() * 1000000)}`}</Text>
        </div>
        <div className="flex justify-between">
          <Text className="font-semibold">Date:</Text>
          <Text>{new Date().toLocaleDateString()}</Text>
        </div>
      </div>
    </div>
  );
};