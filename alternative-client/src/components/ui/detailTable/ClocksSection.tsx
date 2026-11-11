import SpecItem from "./SpecItem";

// TypeScript types
import type { GpuType } from "../../../../../shared/types/types";

interface ClocksSectionProps {
  editableData: GpuType;
  setEditableData: (data: GpuType) => void;
  editMode: boolean;
  overrideMode: boolean;
}

export default function ClocksSection({
  editableData,
  setEditableData,
  editMode,
  overrideMode,
}: ClocksSectionProps) {
  return (
    <div className="gpu-detail-section">
      <h2>Clock Speeds</h2>
      <div className="specs-grid">
        <SpecItem
          editMode={editMode}
          id={"baseclock"}
          type={"number"}
          value={editableData.baseclock}
          label={"Base Clock"}
          displayData={`${editableData.baseclock} MHz`}
          editableData={editableData}
          setEditableData={setEditableData}
        />
        <SpecItem
          editMode={editMode}
          id={"boostclock"}
          type={"number"}
          value={editableData.boostclock}
          label={"Boost Clock"}
          displayData={`${editableData.boostclock} MHz`}
          editableData={editableData}
          setEditableData={setEditableData}
          overrideMode={overrideMode}
        />
        <SpecItem
          editMode={editMode}
          id={"memclock"}
          type={"number"}
          value={editableData.memclock}
          label={"Memory Clock"}
          displayData={`${editableData.memclock} Gbps effective`}
          editableData={editableData}
          setEditableData={setEditableData}
          overrideMode={overrideMode}
        />
      </div>
    </div>
  );
}
