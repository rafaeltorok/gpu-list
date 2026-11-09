import { useEffect, useRef } from "react";
import useGpuContext from "../../hooks/useGpuContext";

import "../../styles/Messages.css";

export default function NotificationMessage() {
  const ref = useRef<HTMLDialogElement>(null);
  const { uiState, uiDispatch } = useGpuContext();

  useEffect(() => {
    if (uiState.notificationMessage) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [uiState.notificationMessage]);

  return (
    <dialog
      className="dialog-container"
      ref={ref}
      onCancel={() =>
        uiDispatch({ type: "TOGGLE_NOTIFICATION_MESSAGE", payload: false })
      }
    >
      <p className="dialog-message">{uiState.dialogMessage}</p>
      <button
        className="dialog-button"
        onClick={() => {
          uiDispatch({ type: "TOGGLE_NOTIFICATION_MESSAGE", payload: false });
        }}
      >
        Close
      </button>
    </dialog>
  );
}
