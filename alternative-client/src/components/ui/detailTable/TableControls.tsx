import useGpuContext from "../../../hooks/useGpuContext";

// TypeScript type
import type { GpuType } from "../../../../../shared/types/types";

interface TableControlsProps {
  handleEdit: () => Promise<void>;
  originalData: GpuType;
  setEditableData: (data: GpuType) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  overrideMode: boolean;
  setOverrideMode: (mode: boolean) => void;
}

export default function TableControls({
  handleEdit,
  originalData,
  setEditableData,
  editMode,
  setEditMode,
  overrideMode,
  setOverrideMode,
}: TableControlsProps) {
  const { dataDispatch, uiDispatch } = useGpuContext();

  return (
    <>
      {editMode || overrideMode ? (
        <div className="gpu-detail-actions-two-buttons">
          <button
            id="confirm-button"
            onClick={() => {
              if (overrideMode) setOverrideMode(false);
              if (editMode) void handleEdit();
            }}
          >
            Confirm
          </button>

          <button
            id="cancel-button"
            onClick={() => {
              setEditMode(false);
              setOverrideMode(false);
              setEditableData(originalData);
            }}
          >
            {editMode && "Cancel"}
            {overrideMode && "Reset"}
          </button>
        </div>
      ) : (
        <div className="gpu-detail-actions-three-buttons">
          <button
            id="override-button"
            onClick={() => setOverrideMode(true)}
          >
            Override Clock
          </button>

          <button
            id="edit-button"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>

          <button
            id="delete-button"
            onClick={() => {
              dataDispatch({
                type: "SET_SELECTED_GPU",
                payload: originalData,
              });
              uiDispatch({
                type: "SET_DIALOG_MESSAGE",
                payload: `Remove ${originalData.manufacturer} ${originalData.gpuline} ${originalData.model} from the list?`,
              });
              uiDispatch({
                type: "TOGGLE_CONFIRMATION_MESSAGE",
                payload: true,
              });
            }}
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}
