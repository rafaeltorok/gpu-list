import type { GpuType } from "../../../../../shared/types/types";

interface SpecItemProps {
  editMode: boolean;
  id: string;
  type: string;
  value: string | number;
  label: string;
  displayData: string;
  editableData: GpuType;
  setEditableData: (data: GpuType) => void;
  overrideMode?: boolean;
}

export default function SpecItem({
  editMode,
  id,
  type,
  value,
  label,
  displayData,
  editableData,
  setEditableData,
  overrideMode,
}: SpecItemProps) {
  return (
    <div className="spec-item">
      {editMode || overrideMode ? (
        <>
          <label
            htmlFor={id}
            className="spec-label"
          >
            {label}
          </label>
          <input
            type={type}
            id={id}
            className="spec-input-field"
            value={value || ""}
            onChange={(e) => {
              if (type === "string") {
                setEditableData({ ...editableData, [id]: e.target.value.trim() });
              } else {
                setEditableData({ ...editableData, [id]: Number(e.target.value.trim()) });
              }
            }}
          />
        </>
      ) : (
        <>
          <span className="spec-label">{label}</span>
          <span className="spec-value">{displayData}</span>
        </>
      )}
    </div>
  );
}
