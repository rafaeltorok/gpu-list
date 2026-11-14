import { useEffect, useReducer } from "react";
import gpuService from "./services/gpus";

// React context
import GpuContext from "./context/GpuContext";
import dataReducer, { initialDataState } from "./reducers/dataReducer";
import uiReducer, { initialUiState } from "./reducers/uiReducer";

// Components
import AddGpuForm from "./components/addForm/AddGpuForm";
import SearchBar from "./components/SearchBar";
import PageIndex from "./components/index/PageIndex";
import ShowAllButton from "./components/ShowAllButton";
import ListContainer from "./components/list/ListContainer";
import Limit from "./components/list/Limit";
import CardsCounter from "./components/list/CardsCounter";
import ConfirmMessage from "./components/dialogMessages/ConfirmMessage";
import NotificationMessage from "./components/dialogMessages/NotificationMessage";
import LoadingMessage from "./components/dialogMessages/LoadingMessage";

// CSS Styles
import "./styles/App.css";

// TypeScript types
import type { GpuType, GpuInputType } from "../../shared/types/types";

// Main App component
function App() {
  const [dataState, dataDispatch] = useReducer(dataReducer, initialDataState);
  const [uiState, uiDispatch] = useReducer(uiReducer, initialUiState);

  useEffect(() => {
    async function getData(): Promise<void> {
      try {
        uiDispatch({
          type: "TOGGLE_LOADING_MESSAGE",
          payload: true,
        });
        dataDispatch({ type: "FETCH_START" });
        const data: GpuType[] = await gpuService.getAll();
        dataDispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err: unknown) {
        if (err instanceof Error) {
          dataDispatch({ type: "FETCH_FAILURE", payload: err.message });
        } else {
          dataDispatch({ type: "FETCH_FAILURE", payload: String(err) });
        }
      } finally {
        uiDispatch({
          type: "TOGGLE_LOADING_MESSAGE",
          payload: false,
        });
      }
    }
    void getData();
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

  // Add a new card to the database
  async function createGpu(newGpu: GpuInputType): Promise<boolean> {
    try {
      const gpu: GpuType = await gpuService.create(newGpu);

      // Add the card
      dataDispatch({
        type: "ADD_GPU",
        payload: gpu,
      });

      // Set a success notification message
      uiDispatch({
        type: "SET_DIALOG_MESSAGE",
        payload: `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model} was added!`,
      });
      uiDispatch({
        type: "TOGGLE_NOTIFICATION_MESSAGE",
        payload: true,
      });
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Error adding new GPU:", err);

      // Set an error message
      uiDispatch({
        type: "SET_DIALOG_MESSAGE",
        payload: `Failed to add a new card: ${String(err)}`,
      });
      uiDispatch({
        type: "TOGGLE_NOTIFICATION_MESSAGE",
        payload: true,
      });

      return false;
    }

    // Confirms the GPU was added, so the AddGpuForm component can clear the form data
    return true;
  }

  // Remove a GPU from the list, after the confirmation message
  async function deleteGpu(): Promise<void> {
    try {
      const gpu = dataState.selectedGpu;

      if (!gpu) {
        throw new Error("No GPU to be removed");
      }

      await gpuService.remove(gpu.id);
      // Filter out the removed card from the list
      dataDispatch({
        type: "FETCH_SUCCESS",
        payload: dataState.gpus.filter((g) => g.id !== gpu.id),
      });

      // Set a success notification message
      uiDispatch({
        type: "SET_DIALOG_MESSAGE",
        payload: `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model} was removed`,
      });
      uiDispatch({
        type: "TOGGLE_NOTIFICATION_MESSAGE",
        payload: true,
      });
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Error deleting GPU:", err);

      // Set an error message
      uiDispatch({
        type: "SET_DIALOG_MESSAGE",
        payload: `Failed to remove the card: ${String(err)}`,
      });
      uiDispatch({
        type: "TOGGLE_NOTIFICATION_MESSAGE",
        payload: true,
      });
    } finally {
      // Reset the current selected GPU
      dataDispatch({
        type: "SET_SELECTED_GPU",
        payload: null,
      });
    }
  }

  // "Edit" button from the table, update a GPU specs from the database
  async function editGpu(newData: GpuType): Promise<boolean> {
    try {
      if (!newData) {
        throw new Error("No GPU to be updated");
      }

      await gpuService.update(newData.id, newData);

      // Update the list with the new card's specs
      const data: GpuType[] = await gpuService.getAll();
      dataDispatch({ type: "FETCH_SUCCESS", payload: data });

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Error updating data:", err);

      // Set an error message
      uiDispatch({
        type: "SET_DIALOG_MESSAGE",
        payload: `Failed to update specs: ${String(err)}`,
      });
      uiDispatch({
        type: "TOGGLE_NOTIFICATION_MESSAGE",
        payload: true,
      });

      return false;
    } finally {
      // Reset the current selected GPU
      dataDispatch({
        type: "SET_SELECTED_GPU",
        payload: null,
      });
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
        editGpu,
        dataState,
        dataDispatch,
        uiState,
        uiDispatch,
      }}
    >
      <a href="/alt/" className="swap-ui-link">Alternative UI</a>

      <header>
        <h1 id="main-page-title">GPU List</h1>
      </header>

      <nav>
        <AddGpuForm />
        <SearchBar />
        <PageIndex />
        <ShowAllButton />

        <div className="items-section-container">
          <Limit />
          <hr />
          <CardsCounter />
        </div>
      </nav>

      <ListContainer />

      <LoadingMessage />
      <NotificationMessage />
      <ConfirmMessage />
    </GpuContext.Provider>
  );
}

export default App;
