import React, { useEffect, useState } from "react";

import Select from "react-select";
import { loadJsonFromLocalStorage } from "../utils/excelToJson.ts";
import { Option } from "../types/RevolvingFundItems.ts";

interface NatureDropdownProps {
  onSelect: (selectedOption: Option | null) => void; // Add this prop
  placeholder?: string;
}

export const NatureDropdown: React.FC<NatureDropdownProps> = ({ onSelect, placeholder = "Select Collection..." }) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    initializeOptions();
  }, []);

  const initializeOptions = () => {
    console.log("initializeOptions");
    const data = loadJsonFromLocalStorage();
    // console.log(data);
    if (data) {
      setOptions(data);
    }
  };

  const handleSelectChange = (event: any) => {
    const selectedNature = event.value;
    const selectedOption = options.find((option) => option.nature === selectedNature);
    onSelect(selectedOption || null); // Pass the selected option
  };

  return (
    <Select
      options={options.map((option) => ({ label: option.nature, value: option.nature }))}
      onChange={handleSelectChange}
      isSearchable
      placeholder={placeholder}
      // styles={{
      //   menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure dropdown appears above everything
      // }}
      // menuPortalTarget={document.body} // Renders the dropdown outside the modal
    />
  );
};
