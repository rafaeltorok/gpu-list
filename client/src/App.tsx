// Client base dependencies
import { useEffect, useReducer } from "react";
import gpuService from "./services/gpus";
import GpuContext from "./Context/GpuContext.js";
import dataReducer, { initialDataState } from "./reducers/dataReducer";
import uiReducer, { initialUiState } from "./reducers/uiReducer";

// Components
import AddGpuForm from "./components/AddGpuForm";
import SearchBar from "./components/SearchBar";
import PageIndex from "./components/PageIndex";
import ShowAllButton from "./components/ShowAllButton.js";
import GpuList from "./components/GpuList";

// CSS Styles
import "./styles/App.css";

// TypeScript types
import type { GpuType, GpuInputType } from "./types/gpu.js";

// Main App component
function App() {
  const [dataState, dataDispatch] = useReducer(dataReducer, initialDataState);
  const [uiState, uiDispatch] = useReducer(uiReducer, initialUiState);

  useEffect(() => {
    async function getData() {
      try {
        dataDispatch({ type: "FETCH_START" });
        const data: GpuType[] = await gpuService.getAll();
        dataDispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err: unknown) {
        if (err instanceof Error) {
          dataDispatch({ type: "FETCH_FAILURE", payload: err.message });
        } else {
          dataDispatch({ type: "FETCH_FAILURE", payload: String(err) });
        }
      }
    }
    getData();
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (uiState.searchGpu) {
        const filteredGpus: GpuType[] = dataState.gpus.filter((g) =>
          `${g.manufacturer}${g.gpuline}${g.model}`
            .toLowerCase()
            .includes(uiState.searchGpu.toLowerCase()),
        );
        dataDispatch({
          type: "SET_FOUND",
          payload: filteredGpus,
        });
      } else {
        dataDispatch({
          type: "SET_FOUND",
          payload: [],
        });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [uiState.searchGpu, dataState.gpus]);

  async function createGpu(newGpu: GpuInputType): Promise<boolean> {
    try {
      const gpu: GpuType = await gpuService.create(newGpu);
      dataDispatch({
        type: "ADD_GPU",
        payload: gpu,
      });
      console.log("GPU Specs Submitted:", gpu);
      alert(`${gpu.manufacturer} ${gpu.gpuline} ${gpu.model} was added!`);
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Error adding new GPU:", err);
      return false;
    }

    // Confirms the GPU was added, so the AddGpuForm component can clear the form data
    return true;
  }

  async function deleteGpu(gpu: GpuType): Promise<void> {
    const confirmDeletion: boolean = window.confirm(
      `Remove ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model} from the list?`,
    );

    if (confirmDeletion) {
      try {
        await gpuService.remove(gpu.id);
        dataDispatch({
          type: "FETCH_SUCCESS",
          payload: dataState.gpus.filter((g) => g.id !== gpu.id),
        });
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Error deleting GPU:", err);
      }
    }
  }

  if (dataState.loading) return <h2>Loading GPU data, please wait...</h2>;

  if (dataState.error)
    return <h2>Failed to retrieve GPU data: {dataState.error}</h2>;

  return (
    <GpuContext.Provider
      value={{
        createGpu,
        deleteGpu,
        dataState,
        dataDispatch,
        uiState,
        uiDispatch,
      }}
    >
      <div>
        <h1 id="main-page-title">GPU List</h1>
        <AddGpuForm />
        <SearchBar />
        <PageIndex />
        <ShowAllButton />
        <GpuList />
      </div>
    </GpuContext.Provider>
  );
}

export default App;
