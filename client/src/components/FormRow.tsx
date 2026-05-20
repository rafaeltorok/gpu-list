// Dependencies
import React from "react";

// TypeScript types
type formRowProps = {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

// Component
export default function FormRow({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
}: formRowProps) {
  return (
    <div className="form-row">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
