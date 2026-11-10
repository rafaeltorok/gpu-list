import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import gpuService from "./services/gpus";
import "./styles/App.css";

// Context/Reducers
import GpuContext from "./context/GpuContext";
import dataReducer, { initialDataState } from "./reducers/dataReducer";
import uiReducer, { initialUiState } from "./reducers/uiReducer";

// Hooks
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/pages/Home";
import GpuDetail from "./components/pages/GpuDetail";
import LoadingMessage from "./components/ui/dialogMessages/LoadingMessage";
import NotificationMessage from "./components/ui/dialogMessages/NotificationMessage";
import ConfirmMessage from "./components/ui/dialogMessages/ConfirmMessage";

import type { GpuInputType, GpuType } from "../../shared/types/types";

export default function App() {
  const [dataState, dataDispatch] = useReducer(dataReducer, initialDataState);
  const [uiState, uiDispatch] = useReducer(uiReducer, initialUiState);
  const navigate = useNavigate();

  // Fetch all available cards from the database
  useEffect(() => {
    async function getData() {
      try {
        // Setup a loading message when first opening the home page
        uiDispatch({
          type: "SET_DIALOG_MESSAGE",
          payload: "Loading data, please wait...",
        });
        uiDispatch({
          type: "TOGGLE_LOADING_MESSAGE",
          payload: true,
        });

        // Fetch the data from the server
        const data: GpuType[] = await gpuService.getAll();
        dataDispatch({
          type: "SET_GPUS",
          payload: data,
        });
      } catch (err) {
        console.error("Failed to fetch GPU data:", err);

        // Display an error message within the UI
        uiDispatch({
          type: "TOGGLE_NOTIFICATION_MESSAGE",
          payload: true,
        });
        uiDispatch({
          type: "SET_DIALOG_MESSAGE",
          payload: `Failed to fetch GPU data: ${String(err)}`,
        });
      } finally {
        uiDispatch({
          type: "TOGGLE_LOADING_MESSAGE",
          payload: false,
        });
      }
    }
    void getData();
  }, []);

  // Handles filtering the GPU list based on a search term, if available
  useEffect(() => {
    const filteredGpus = dataState.gpus.filter((gpu: GpuType) => {
      const fullName =
        `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`.toLowerCase();
      return fullName.includes(uiState.searchTerm.toLowerCase());
    });

    dataDispatch({
      type: "SET_FOUND",
      payload: filteredGpus,
    });
  }, [uiState.searchTerm, dataState.gpus]);

  // Handles the add form data
  async function addGpu(gpuObject: GpuInputType): Promise<void> {
    if (
      gpuObject.manufacturer === "" ||
      gpuObject.gpuline === "" ||
      gpuObject.model === "" ||
      gpuObject.cores < 1 ||
      gpuObject.tmus < 1 ||
      gpuObject.rops < 1 ||
      gpuObject.vram < 0.016 ||
      gpuObject.bus < 1 ||
      gpuObject.memtype === "" ||
      gpuObject.baseclock < 1 ||
      gpuObject.boostclock < 1 ||
      gpuObject.memclock < 1
    ) {
      // Display an error message within the UI
      uiDispatch({
        type: "SET_DIALOG_MESSAGE",
        payload: "Invalid GPU data",
      });
      uiDispatch({
        type: "TOGGLE_NOTIFICATION_MESSAGE",
        payload: true,
      });
      return;
    }

    try {
      // Make the API call to add the new graphics card
      const returnedObject = await gpuService.create(gpuObject);

      dataDispatch({
        type: "SET_GPUS",
        payload: [...dataState.gpus, returnedObject],
      });

      // Set a success message within the UI
      uiDispatch({
        type: "TOGGLE_NOTIFICATION_MESSAGE",
        payload: true,
      });
      uiDispatch({
        type: "SET_DIALOG_MESSAGE",
        payload: `${returnedObject.manufacturer} ${returnedObject.gpuline} ${returnedObject.model} was added!`,
      });

      // Close the add form
      uiDispatch({
        type: "TOGGLE_ADD_FORM",
      });
    } catch (err) {
      console.error("Failed to add new Graphics Card:", err);

      // Display an error message within the UI
      uiDispatch({
        type: "TOGGLE_NOTIFICATION_MESSAGE",
        payload: true,
      });
      uiDispatch({
        type: "SET_DIALOG_MESSAGE",
        payload: `"Failed to add new Graphics Card: ${String(err)}`,
      });
    }
  }

  async function deleteGpu(): Promise<void> {
    // Get the currently selected card to me removed
    const gpu = dataState.selectedGpu;

    if (gpu) {
      try {
        // Perform the API call to remove the card
        await gpuService.remove(gpu.id);

        // Filter the removed card from the list
        const filteredList = dataState.gpus.filter(
          (g: GpuType) => g.id !== gpu.id,
        );
        dataDispatch({
          type: "SET_GPUS",
          payload: filteredList,
        });

        // Exit the removed card data page and return to the Home
        void navigate("/");
      } catch (err) {
        console.error("Failed do remove GPU from the list:", err);

        // Display an error message within the UI
        uiDispatch({
          type: "TOGGLE_NOTIFICATION_MESSAGE",
          payload: true,
        });
        uiDispatch({
          type: "SET_DIALOG_MESSAGE",
          payload: `Failed do remove GPU from the list: ${String(err)}`,
        });
      } finally {
        dataDispatch({
          type: "SET_SELECTED_GPU",
          payload: null,
        });
      }
    }
  }

  return (
    <div className="app-container">
      <GpuContext.Provider
        value={{
          addGpu,
          deleteGpu,
          dataState,
          dataDispatch,
          uiState,
          uiDispatch,
        }}
      >
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gpu/:id" element={<GpuDetail />} />
          </Routes>
        </main>
        <Footer />

        <LoadingMessage />
        <NotificationMessage />
        <ConfirmMessage />
      </GpuContext.Provider>
    </div>
  );
}
