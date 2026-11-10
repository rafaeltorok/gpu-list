import { useEffect, useRef } from "react";
import useGpuContext from "../../../hooks/useGpuContext";

import "../../../styles/Messages.css";

export default function ConfirmMessage() {
  const ref = useRef<HTMLDialogElement>(null);
  const { uiState, uiDispatch, dataDispatch, deleteGpu } = useGpuContext();

  useEffect(() => {
    if (uiState.confirmationMessage) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [uiState.confirmationMessage]);

  return (
    <dialog
      className="dialog-container"
      ref={ref}
      onCancel={() =>
        uiDispatch({ type: "TOGGLE_CONFIRMATION_MESSAGE", payload: false })
      }
    >
      <p className="dialog-message">{uiState.dialogMessage}</p>
      <div className="dialog-buttons-wrapper">
        <button
          className="dialog-button"
          onClick={() => {
            uiDispatch({ type: "TOGGLE_CONFIRMATION_MESSAGE", payload: false });
            void deleteGpu();
          }}
        >
          Confirm
        </button>
        <button
          className="dialog-button"
          onClick={() => {
            uiDispatch({ type: "TOGGLE_CONFIRMATION_MESSAGE", payload: false });
            dataDispatch({ type: "SET_SELECTED_GPU", payload: null });
          }}
        >
          Cancel
        </button>
      </div>
    </dialog>
  );
}
