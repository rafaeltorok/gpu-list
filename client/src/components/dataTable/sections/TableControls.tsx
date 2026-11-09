import useGpuContext from "../../../hooks/useGpuContext";

// TypeScript types
import type { GpuType } from "../../../../../shared/types/types";

interface TableControlsProps {
  gpu: GpuType;
  setGpuData: (data: GpuType) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  overrideMode: boolean;
  setOverrideMode: (mode: boolean) => void;
  updateGpuData: () => Promise<void>;
}

// Component
export default function TableControls({
  gpu,
  setGpuData,
  editMode,
  setEditMode,
  overrideMode,
  setOverrideMode,
  updateGpuData,
}: TableControlsProps) {
  const { uiDispatch, dataDispatch } = useGpuContext();

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
                onClick={() => void updateGpuData()}
              >
                Save
              </button>
            ) : (
              <button
                aria-label={`Edit ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
                onClick={() => void setEditMode(true)}
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
            onClick={() => {
              dataDispatch({
                type: "SET_SELECTED_GPU",
                payload: gpu,
              });
              uiDispatch({
                type: "SET_DIALOG_MESSAGE",
                payload: `Remove ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model} from the list?`,
              });
              uiDispatch({
                type: "TOGGLE_CONFIRMATION_MESSAGE",
                payload: true,
              });
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
