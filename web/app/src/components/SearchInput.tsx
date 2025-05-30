import React, { useState, useEffect, useRef } from "react";
import { useTransactions } from "../context/TransactionContext.tsx";
import { useClientDetails } from "../context/ClientDetailsContext.tsx";
import { CustomButton } from "./ui/CustomButton.tsx";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "../hooks/ClickOutside.js";
import Highlighter from "react-highlight-words";

type searchInputProps = {
  isHeader: boolean;
  clientName?: string;
  onClick?: (clientId: string) => void;
};

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const SearchInput: React.FC<searchInputProps> = ({ isHeader, onClick, clientName = "" }) => {
  const { getSuggestionsbyClientName, getSuggestionsbyStudentNumber } = useTransactions();

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { setClientID } = useClientDetails();
  const [showResults, setShowResults] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debouncedValue = useDebounce(searchInput, 200);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  useClickOutside(wrapperRef, () => {
    setShowResults(false);
  });

  useEffect(() => {
    async function loadResults() {
      if (debouncedValue) {
        try {
          const results = await handleSearch(searchInput);
          setSuggestions(results);
          setShowResults(true);
        } catch (error) {
          console.error("Error searching for client details:", error);
        }
      } else {
        setShowResults(false);
      }
    }
    loadResults();
  }, [debouncedValue]);

  //handle search function
  const handleSearch = async (searchInput: string) => {
    let clients: any[] = [];

    // check if the search input is a student number
    if (!isNaN(parseInt(searchInput))) {
      try {
        console.log("searching for student number:", searchInput);
        clients = await getSuggestionsbyStudentNumber(searchInput);
        console.log("fetched Transactions by student number:", clients);
      } catch (error) {
        console.error("Error searching for student client details:", error);
      }
    } else {
      try {
        clients = await getSuggestionsbyClientName(searchInput);
        console.log("fetched Transactions by client name:", clients);
        return clients;
      } catch (error) {
        console.error("Error searching for client details:", error);
      }
    }
    return clients;
  };

  // handle key down function
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchInput(event.currentTarget.value);
      handleSearch(searchInput);
    }
  };

  const handleSuggestionClick = (chosen: string) => {
    console.log("suggestion clicked: ", chosen);
    setClientID(chosen);
    setShowResults(false);
    setSearchInput("");
    if (isHeader) {
      navigate("/client-details", { state: { clientId: chosen } });
    } else {
      onClick?.(chosen);
    }
  };

  return (
    <div ref={wrapperRef} className="flex flex-grow max-w-[600px] relative">
      <input
        type="search"
        value={searchInput}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search existing payor using name or student number(eg. 201912345)"
        className="rounded-l-full border-secondary-border shadow-inner shadow-secondary py-1 px-4 text-md w-full 
            focus:border-blue-500 outline-none"
      />
      <CustomButton
        className="py-2 px-4 rounded-r-full border-secondary-border border border-l-0 flex-shrink-0"
        onClick={() => handleSearch(searchInput)}
      >
        <Search />
      </CustomButton>
      {showResults && (
        <div className="absolute top-full left-0 w-full z-51 mt-2 bg-white border shadow-lg rounded">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex flex-col gap-2">
              <div
                className="flex items-center gap-2 bg-gray-100 p-6 rounded hover:bg-up_yellow cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion.id)}
              >
                <Highlighter
                  searchWords={[searchInput.trim()]}
                  autoEscape={true}
                  textToHighlight={suggestion.name}
                  highlightTag="strong"
                />
                <span>{suggestion.type}</span>
                <Highlighter
                  searchWords={[searchInput.trim()]}
                  autoEscape={true}
                  textToHighlight={suggestion.studentInfo?.studentNumber?.toString() || ""}
                  highlightTag="strong"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
