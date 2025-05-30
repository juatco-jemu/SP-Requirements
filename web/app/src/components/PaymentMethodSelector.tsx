import React, { useState } from "react";
import { CustomButton } from "./ui/CustomButton.tsx";

export type PaymentMethod = "CASH" | "ADA/Bank Transfers" | "Check";

interface PaymentMethodSelectorProps {
  onPaymentMethodChange: (paymentMethod: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ onPaymentMethodChange }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const paymentMethods: PaymentMethod[] = ["CASH", "Check", "ADA/Bank Transfers"];

  const handleSelection = (method: PaymentMethod) => {
    setSelectedMethod(method);
    onPaymentMethodChange(method);
  };

  return (
    <div className="flex space-x-4">
      {paymentMethods.map((method) => (
        <CustomButton
          key={method}
          onClick={() => handleSelection(method)}
          className={`px-4 py-2 rounded border transition
            ${
              selectedMethod === method
                ? "bg-up_green text-white hover:bg-up_green-hover hover:text-white"
                : "bg-white text-black border-gray-300 hover:bg-up_green hover:text-white"
            }`}
        >
          {method}
        </CustomButton>
      ))}
    </div>
  );
};
