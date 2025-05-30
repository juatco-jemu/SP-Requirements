import React from "react";
import Select, { SingleValue } from "react-select";
import { Option } from "../types/RevolvingFundItems.ts";

export interface DropdownProps {
  value: string;
  name: string;
}

interface SelectDropdownProps {
  options: Option[];
  onValueChange: (selectedOption: String) => void;
  placeholder?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  onValueChange,
  placeholder = "Select an option...",
}) => {
  const handleChange = (selectedOption: SingleValue<{ label: string; value: string }>) => {
    if (selectedOption && onValueChange) {
      onValueChange(selectedOption.value); // Pass the selected value (nature)
    }
  };

  return (
    <Select
      options={options.map((option) => ({ label: option.nature, value: option.nature }))}
      onChange={handleChange}
      isSearchable
      placeholder={placeholder}
    />
  );
};
