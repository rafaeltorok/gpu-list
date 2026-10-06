import useGpuContext from "../../../hooks/useGpuContext";

// TypeScript types
import type { GpuType } from "../../../../../shared/types/types";
import type { UpdateGpuDataProps } from "../../../types/componentProps";

interface TableControlsProps {
  gpu: GpuType;
  gpuData: GpuType;
  setGpuData: (data: GpuType) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  updateGpuData: (props: UpdateGpuDataProps) => Promise<void>;
}

// Component
export default function TableControls({
  gpu,
  gpuData,
  setGpuData,
  editMode,
  setEditMode,
  updateGpuData,
}: TableControlsProps) {
  const { deleteGpu, editGpu } = useGpuContext();

  return (
    <tfoot id={`${gpu.id}-delete`}>
      {/* Edit/Save button row */}
      <tr>
        <td colSpan={2} id="edit-gpu-button">
          {editMode ? (
            <button
              aria-label={`Save ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
              onClick={() =>
                void updateGpuData({ gpu: gpuData, setEditMode, editGpu })
              }
            >
              Save
            </button>
          ) : (
            <button
              aria-label={`Edit ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
              onClick={() => {
                void setGpuData({ ...gpu });
                void setEditMode(true);
              }}
            >
              Edit
            </button>
          )}
        </td>
      </tr>

      {/* Delete/Cancel button row */}
      <tr>
        <td colSpan={2} id="delete-gpu-button">
          {editMode ? (
            <button
              aria-label={`Cancel ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
              onClick={() => {
                setEditMode(false);
                setGpuData({ ...gpu });
              }}
            >
              Cancel
            </button>
          ) : (
            <button
              aria-label={`Delete ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
              onClick={() => void deleteGpu(gpu)}
            >
              Delete
            </button>
          )}
        </td>
      </tr>
    </tfoot>
  );
}
