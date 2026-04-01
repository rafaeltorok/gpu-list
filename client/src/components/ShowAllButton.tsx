import useGpuContext from "../hooks/useGpuContext";

export default function ShowAllButton() {
  const { uiState, uiDispatch } = useGpuContext();

  return (
    <div id="show-all-button" className="button-area">
      <button
        onClick={() =>
          uiDispatch({
            type: "TOGGLE_SHOW_ALL",
          })
        }
      >
        {uiState.showAll ? "Hide all data" : "Show all data"}
      </button>
    </div>
  );
}
