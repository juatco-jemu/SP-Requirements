import React from "react";

interface TextInputProps {
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  readOnly?: boolean;
  name?: string;
  id?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  readOnly = false,
  name,
}) => {
  return (
    <input
      id={id}
      readOnly={readOnly}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300 rounded-lg bg-white p-2 ${className}`}
    />
  );
};
