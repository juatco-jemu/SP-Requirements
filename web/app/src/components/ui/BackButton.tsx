import React from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "./CustomButton.tsx";
import { ChevronLeft } from "lucide-react";

export const BackButton = () => {
  const navigate = useNavigate();
  return (
    <CustomButton size="icon" onClick={() => navigate(-1)}>
      <ChevronLeft />
    </CustomButton>
  );
};
