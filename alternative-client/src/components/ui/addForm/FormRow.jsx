import PropTypes from "prop-types";

export default function FormRow({
  id,
  type,
  label,
  value,
  placeholder,
  setGpu,
  step,
}) {
  return (
    <div className="form-row">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value || ""}
        placeholder={placeholder}
        step={step}
        onChange={(event) => {
          // Prevents stale data on the React state
          const { name, value } = event.target;
          setGpu((prev) => ({ ...prev, [name]: value.trimStart() }));
        }}
      />
    </div>
  );
}

FormRow.displayName = "FormRow";

FormRow.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  setGpu: PropTypes.func.isRequired,
  step: PropTypes.string,
}
