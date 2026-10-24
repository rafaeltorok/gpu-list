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
  overrideMode: boolean;
  setOverrideMode: (mode: boolean) => void;
  updateGpuData: (props: UpdateGpuDataProps) => Promise<void>;
}

// Component
export default function TableControls({
  gpu,
  gpuData,
  setGpuData,
  editMode,
  setEditMode,
  overrideMode,
  setOverrideMode,
  updateGpuData,
}: TableControlsProps) {
  const { deleteGpu, editGpu } = useGpuContext();

  return (
    <div id={`${gpu.id}-delete`}>
      {/* Override clocks buttons */}
      <div id="override-clocks-button">
        {!editMode && (
          <>
            {overrideMode ? (
              <button
                aria-label={`Confirm override ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
                onClick={() => {
                  void setOverrideMode(false);
                }}
              >
                Confirm
              </button>
            ) : (
              <button
                aria-label={`Override ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
                onClick={() => {
                  void setOverrideMode(true);
                }}
              >
                Override Clocks
              </button>
            )}
          </>
        )}
      </div>

      {/* Edit/Save buttons */}
      <div id="edit-gpu-button">
        {!overrideMode && (
          <>
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
                  void setEditMode(true);
                }}
              >
                Edit
              </button>
            )}
          </>
        )}
      </div>

      {/* Delete/Cancel buttons */}
      <div id="delete-gpu-button">
        {editMode || overrideMode ? (
          <button
            aria-label={`Cancel ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
            onClick={() => {
              setEditMode(false);
              setOverrideMode(false);
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
      </div>
    </div>
  );
}
