import React, { forwardRef } from "react";
import { CustomButton } from "./ui/CustomButton.tsx";
import { X } from "lucide-react";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export function CustomModal({ children, className, style, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white p-6 rounded shadow-lg w-96 relative ${className}`} style={style}>
        <CustomButton variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
          <X />
        </CustomButton>

        {children}
      </div>
    </div>
  );
}

//modal used in user account settings
export const CustomModal2 = forwardRef<HTMLDivElement, ModalProps>(({ children, className, style, onClose }, ref) => {
  return (
    <div ref={ref} className="fixed inset-0 flex items-start justify-end mr-6 mt-16 ">
      <div
        className={`bg-white p-6 rounded shadow-2xl border border-gray w-64 relative ${className}`}
        style={{ ...style, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)" }}
      >
        <CustomButton variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
          <X />
        </CustomButton>

        {children}
      </div>
    </div>
  );
});

//modal used in user account settings
export function CustomModalImageInstruction({ children, className, style, onClose, title }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center align-middle">
      <div
        className={`bg-white p-6 rounded shadow-2xl border border-gray w-[80vw] max-w-6xl relative ${className}`}
        style={{ ...style, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)" }}
      >
        <CustomButton variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
          <X />
        </CustomButton>

        {/* Title */}
        {title && <h2 className="text-xl font-semibold mb-1">{title}</h2>}

        <div className="pt-4 pr-10">{children}</div>
      </div>
    </div>
  );
}
