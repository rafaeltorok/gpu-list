import useGpuContext from "../../../hooks/useGpuContext";

// TypeScript type
import type { GpuType } from "../../../../../shared/types/types";

interface TableControlsProps {
  handleEdit: () => Promise<void>;
  originalData: GpuType;
  setEditableData: (data: GpuType) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
}

export default function TableControls({
  handleEdit,
  originalData,
  setEditableData,
  editMode,
  setEditMode,
}: TableControlsProps) {
  const { dataDispatch, uiDispatch } = useGpuContext();

  return (
    <div className="gpu-detail-actions">
      {editMode ? (
        <>
          <button
            id="confirm-button"
            onClick={() => void handleEdit()}
          >
            Confirm
          </button>

          <button
            id="cancel-button"
            onClick={() => {
              setEditMode(false);
              setEditableData(originalData);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
