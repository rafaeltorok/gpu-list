interface FormRowProps {
  id: string;
  type: string;
  label: string;
  value: number | string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
}

export default function FormRow({
  id,
  type,
  label,
  value,
  placeholder,
  onChange,
  step,
}: FormRowProps) {
  return (
    <div className="form-row">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value || ""}
        placeholder={placeholder}
        step={step || "1"}
        onChange={onChange}
      />
    </div>
  );
}
