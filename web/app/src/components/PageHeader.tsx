import React, { useEffect } from "react";
import logo_white from "../assets/images/uplb-logo-white-text.png";
import { User, Search, ArrowLeft } from "lucide-react";
import { CustomButton } from "./ui/CustomButton.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService.js";
import { CustomModal, CustomModal2 } from "./CustomModal.tsx";
import { clearDexieDatabase } from "../services/dexieDB.js";
import { useUser } from "../context/UserContext.tsx";
import { DropDownSettings } from "./DropdownSettings.tsx";
import { SearchInput } from "./SearchInput.tsx";

interface PageHeaderProps {
  children?: React.ReactNode;
  userDisplayName?: string;
  userDesignation?: string;
  onLogout: () => void;
}

export function PageHeader({ children, userDisplayName, userDesignation, onLogout }: PageHeaderProps) {
  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDropdownSettings, setShowDropdownSettings] = useState(false);
  const navigate = useNavigate();
  const { getUserDetails } = useUser();

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleLogout = () => {
    onLogout();
    logoutUser();
    navigate("/signin");
  };

  return (
    <div className="bg-up_green flex gap-10 lg:gap-30 justify-between py-2 px-4">
      <div className={`gap-4 items-center flex-shrink-0 ${showFullWidthSearch ? "hidden" : "flex"}`}>
        <a href="/home">
          <img src={logo_white} className="h-10" alt="UPLB LOGO" />
        </a>
      </div>

      <CustomButton onClick={() => clearDexieDatabase()}>Clear DB</CustomButton>
      {/* <CustomButton onClick={() => generateTableData()}>Populate DB</CustomButton> */}

      <form className={`gap-5 flex-grow justify-center ${showFullWidthSearch ? "flex" : "hidden md:flex"}`}>
        {showFullWidthSearch && (
          <div>
            <CustomButton
              onClick={() => setShowFullWidthSearch(false)}
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <ArrowLeft />
            </CustomButton>
          </div>
        )}
        <SearchInput />
      </form>

      <div className={`flex-shrink-0 md:gap-2 ${showFullWidthSearch ? "hidden" : "flex"}`}>
        <CustomButton onClick={() => setShowFullWidthSearch(true)} variant="ghost" size="icon" className="md:hidden">
          <Search />
        </CustomButton>
        {children}
        <span className="hidden md:flex py-2 text-white">
          Hello, {userDisplayName === undefined ? "User" : userDisplayName}
        </span>
        <CustomButton
          variant="ghost"
          size="icon"
          className="text-white hover:bg-up_green-hover"
          onClick={() => setShowModal(true)}
        >
          <User />
        </CustomButton>
      </div>
      {showModal && (
        <CustomModal2 onClose={() => setShowModal(false)} className="justify-end flex flex-col">
          <h3 className="text-xl font-semibold mb-4">
            {userDisplayName === undefined ? "User" : userDisplayName}'s Account
          </h3>
          <h3 className="text-md font-semibold mb-4">
            Position: {userDesignation === undefined ? "Unknown" : userDesignation}
          </h3>
          <CustomButton
            onClick={() => setShowDropdownSettings(true)}
            variant="default"
            className="bg-up_yellow mb-2 text-black hover:bg-up_yellow-hover"
          >
            Dropdown Settings
          </CustomButton>
          <CustomButton
            onClick={handleLogout}
            variant="default"
            className="bg-up_maroon text-white hover:bg-up_maroon-hover"
          >
            Logout
          </CustomButton>
        </CustomModal2>
      )}
      {showDropdownSettings && (
        <CustomModal onClose={() => setShowDropdownSettings(false)} className="justify-end flex flex-col">
          <DropDownSettings />
        </CustomModal>
      )}
    </div>
  );
}
