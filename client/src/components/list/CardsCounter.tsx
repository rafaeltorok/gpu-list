import useGpuContext from "../../hooks/useGpuContext";

export default function CardsCounter() {
  const { dataState, uiState } = useGpuContext();

  return (
    <div>
      {uiState.searchGpu ? (
        <p>Search results: {dataState.gpusFound.length}</p>
      ) : (
        <p>Cards available: {dataState.gpus.length}</p>
      )}
    </div>
  );
}
