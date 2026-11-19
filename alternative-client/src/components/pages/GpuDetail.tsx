import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import useGpuContext from "../../hooks/useGpuContext";

// Utils
import getBrand from "../../utils/getBrand";

// CSS styles
import "../../styles/GpuDetail.css";

// Components
import SpecsSection from "../ui/detailTable/SpecsSection";
import ClocksSection from "../ui/detailTable/ClocksSection";
import PerformanceSection from "../ui/detailTable/PerformanceSection";
import TableControls from "../ui/detailTable/TableControls";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";
import type { SwipeEventData } from "react-swipeable";

export default function GpuDetail() {
  // Original card data from the database
  const [originalData, setOriginalData] = useState<GpuType | undefined>();

  // Temporary state-only data to be modified by both the override and edit modes
  const [editableData, setEditableData] = useState<GpuType | undefined>();

  // Activate/deactivates the table modes
  const [editMode, setEditMode] = useState<boolean>(false);
  const [overrideMode, setOverrideMode] = useState<boolean>(false);

  // Defines which are the previous and next cards to navigate between
  const [previousCard, setPreviousCard] = useState<GpuType | undefined>(undefined);
  const [nextCard, setNextCard] = useState<GpuType | undefined>(undefined);

  // Hooks
  const { dataState, uiState, uiDispatch, editGpu } = useGpuContext();
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the respective card from the list based on its ID value
  useEffect(() => {
    const currentGpu = dataState.gpus.find((gpu: GpuType) => gpu.id === id);
    setOriginalData(currentGpu);
    setEditableData(currentGpu);
  }, [dataState.gpus, originalData, id]);

  // Get the previous and next cards to navigate to
  useEffect(() => {
    const index = uiState.searchTerm ?
      dataState.gpusFound.findIndex((g: GpuType) => g.id === id) :
      dataState.gpus.findIndex((g: GpuType) => g.id === id);
    if (index >= 0) {
      // With a search term available, navigate between the search results only
      if (uiState.searchTerm) {
        setPreviousCard(dataState.gpusFound[index - 1] || undefined);
        setNextCard(dataState.gpusFound[index + 1] || undefined);
      } else {
        setPreviousCard(dataState.gpus[index - 1] || undefined);
        setNextCard(dataState.gpus[index + 1] || undefined);
      }
    }
  }, [id, dataState.gpus, uiState.searchTerm,dataState.gpusFound]);

  // Scroll to the top of the data table when a user selects a card form the list
  useEffect(() => {
    const documentObject = document.querySelector(".gpu-detail-container");

    if (documentObject) {
      documentObject.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Handles keyboard navigation
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Left arrow key
      if (event.key === "ArrowLeft" && previousCard) {
        void navigate(`/gpu/${previousCard.id}`);
      }

      // Right arrow key
      if (event.key === "ArrowRight" && nextCard) {
        void navigate(`/gpu/${nextCard.id}`);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previousCard, nextCard, navigate]);

  // Handles the Touch screen swipe to change the page
  const swipeHandler = useSwipeable({
    onSwiped: (eventData: SwipeEventData) => {
      // Previous page
      if (eventData.dir === "Right" && previousCard) {
        void navigate(`/gpu/${previousCard.id}`);
      }

      // Next page
      if (eventData.dir === "Left" && nextCard) {
        void navigate(`/gpu/${nextCard.id}`);
      }
    },
    delta: 50, // Define the min amount of pixels before a swipe is registered
  });

  // Display a proper message when the card is not found
  if (!originalData || !editableData) {
    return (
      <div className="gpu-detail-container">
        <br />
        <br />
        <h2>No data available</h2>
        <br />
        <br />
        <button className="back-button" onClick={() => void navigate("/")}>
          ⬅ Back to Catalog
        </button>
      </div>
    );
  }

  // Handle submitting the updated specs from the edit mode
  async function handleEdit(): Promise<void> {
    if (editableData) {
      // Validate the new data
      if (
        editableData.manufacturer.trim() === "" ||
        editableData.model.trim() === "" ||
        editableData.cores < 1 ||
        editableData.tmus < 1 ||
        editableData.rops < 1 ||
        editableData.vram < 0.016 ||
        editableData.bus < 1 ||
        editableData.memtype === "" ||
        editableData.baseclock < 1 ||
        editableData.boostclock < 1 ||
        editableData.memclock < 0.001
      ) {
        // Display an error message within the UI
        uiDispatch({
          type: "TOGGLE_NOTIFICATION_MESSAGE",
          payload: true,
        });
        uiDispatch({
          type: "SET_DIALOG_MESSAGE",
          payload: "Invalid GPU data",
        });
        return;
      }

      // Send the valid data to be updated
      const response = await editGpu(editableData);

      if (response) {
        setEditMode(false);
      }
    }
  }

  // Set the table color scheme to the respective manufacturer color
  const brand = getBrand(
    `${editableData.manufacturer} ${editableData.gpuline} ${editableData.model}`,
  );

  return (
    <div
      className="gpu-detail-container"
      {...swipeHandler}
    >
      <div className={`gpu-detail-card ${brand}`}>
        {/* Full model title */}
        <div className="gpu-detail-header">
          <h1>
            {editableData.manufacturer} {editableData.gpuline}{" "}
            {editableData.model}
          </h1>
        </div>

        {/* Wrapper for the GPU data section */}
        <div className="gpu-detail-content">
          <SpecsSection
            editableData={editableData}
            setEditableData={setEditableData}
            editMode={editMode}
          />

          <ClocksSection
            editableData={editableData}
            setEditableData={setEditableData}
            editMode={editMode}
            overrideMode={overrideMode}
          />

          <PerformanceSection editableData={editableData} />
        </div>

        <TableControls
          handleEdit={handleEdit}
          originalData={originalData}
          setEditableData={setEditableData}
          editMode={editMode}
          setEditMode={setEditMode}
          overrideMode={overrideMode}
          setOverrideMode={setOverrideMode}
        />
      </div>

      {/* Return to the home page */}
      <button className="back-button" onClick={() => void navigate("/")}>
        ⬅ Back to Catalog
      </button>
    </div>
  );
}
