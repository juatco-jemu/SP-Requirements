import React from "react";

import { useClickOutside } from "../hooks/ClickOutside";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ProfileSidebar: React.FC<SidebarProps> = ({ isOpen, onClose, children }) => {
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(sidebarRef, onClose);

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      {children}
    </div>
  );
};

export default ProfileSidebar;
