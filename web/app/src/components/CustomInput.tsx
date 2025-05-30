import React, { useState } from "react";
import { CustomButton } from "./ui/CustomButton.tsx";
import { Search } from "lucide-react";

export const CustomSearchClientInput = ({
  onSearch,
  handleKeyDown,
}: {
  onSearch: (searchInput: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <div className="flex flex-grow max-w-[600px]">
      <input
        type="search"
        value={searchInput}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search payor using name or student number(eg. 201912345)"
        className="rounded-l-full border-secondary-border shadow-inner shadow-secondary py-1 px-4 text-md w-full 
            focus:border-blue-500 outline-none"
      />
      <CustomButton
        className="py-2 px-4 rounded-r-full border-secondary-border border border-l-0 flex-shrink-0"
        onClick={handleSearch}
      >
        <Search />
      </CustomButton>
    </div>
  );
};
