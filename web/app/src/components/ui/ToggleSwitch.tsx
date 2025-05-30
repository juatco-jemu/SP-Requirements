import React, { useState } from "react";
import { motion } from "framer-motion";

interface ToggleSwitchProps {
  isOn?: boolean;
  onToggle?: (state: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn = false, onToggle }) => {
  const [enabled, setEnabled] = useState(isOn);

  const toggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle?.(newState);
  };

  return (
    <div
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 caret-transparent ${
        enabled ? "bg-up_green" : "bg-gray-300"
      }`}
      onClick={toggle}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="w-5 h-5 bg-white rounded-full shadow-md"
        style={{ x: enabled ? "100%" : "0%" }}
      />
    </div>
  );
};

export default ToggleSwitch;
