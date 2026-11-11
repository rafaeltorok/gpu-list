import displayVramAmount from "../../../utils/displayVramAmount";
import SpecItem from "./SpecItem";

// TypeScript types
import type { GpuType } from "../../../../../shared/types/types";

interface SpecsSectionProps {
  editableData: GpuType;
  setEditableData: (data: GpuType) => void;
  editMode: boolean;
}

export default function SpecsSection({
  editableData,
  setEditableData,
  editMode,
}: SpecsSectionProps) {
  return (
    <div className="gpu-detail-section">
      <h2>Specifications</h2>
      <div className="specs-grid">
        <SpecItem
          editMode={editMode}
          id={"cores"}
          type={"number"}
          value={editableData.cores}
          label={"Cores"}
          displayData={String(editableData.cores)}
          editableData={editableData}
          setEditableData={setEditableData}
        />
        <SpecItem
          editMode={editMode}
          id={"tmus"}
          type={"number"}
          value={editableData.tmus}
          label={"TMUs"}
          displayData={String(editableData.tmus)}
          editableData={editableData}
          setEditableData={setEditableData}
        />
        <SpecItem
          editMode={editMode}
          id={"rops"}
          type={"number"}
          value={editableData.rops}
          label={"ROPs"}
          displayData={String(editableData.rops)}
          editableData={editableData}
          setEditableData={setEditableData}
        />
        <SpecItem
          editMode={editMode}
          id={"vram"}
          type={"number"}
          value={editableData.vram}
          label={"VRAM"}
          displayData={`${displayVramAmount(editableData.vram)} ${editableData.memtype}`}
          editableData={editableData}
          setEditableData={setEditableData}
        />
        <SpecItem
          editMode={editMode}
          id={"bus"}
          type={"number"}
          value={editableData.bus}
          label={"Bus Width"}
          displayData={`${editableData.bus} bit`}
          editableData={editableData}
          setEditableData={setEditableData}
        />
      </div>
    </div>
  );
}
