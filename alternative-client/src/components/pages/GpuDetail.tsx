import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGpuContext from "../../hooks/useGpuContext";

// Utils
import getBrand from "../../utils/getBrand";

// CSS styles
import "../../styles/GpuDetail.css";

// Components
import SpecsSection from "../ui/detailTable/SpecsSection";
import ClocksSection from "../ui/detailTable/ClocksSection";
import PerformanceSection from "../ui/detailTable/PerformanceSection";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";
import TableControls from "../ui/detailTable/TableControls";

export default function GpuDetail() {
  // React states
  const [originalData, setOriginalData] = useState<GpuType | undefined>();
  const [editableData, setEditableData] = useState<GpuType | undefined>();
  const [editMode, setEditMode] = useState<boolean>(false);

  // Hooks
  const { dataState, uiDispatch, editGpu } = useGpuContext();
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the respective card from the list based on its ID value
  useEffect(() => {
    setOriginalData(dataState.gpus.find((gpu: GpuType) => gpu.id === id));
    setEditableData(originalData);
  }, [dataState.gpus, originalData, id]);

  // Scroll to the top of the data table when a user selects a card form the list
  useEffect(() => {
    const documentObject = document.querySelector(".gpu-detail-container");

    if (documentObject) {
      documentObject.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Display a proper message when the card is not found
  if (!originalData || !editableData) {
    return (
      <div className="gpu-detail-container">
        <h2>GPU Not Found</h2>
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
    `${editableData.manufacturer} ${editableData.gpuline} ${editableData.model}`
  );

  return (
    <div className="gpu-detail-container">
      <div className={`gpu-detail-card ${brand}`}>
        {/* Full model title */}
        <div className="gpu-detail-header">
          <h1>
            {editableData.manufacturer} {editableData.gpuline} {editableData.model}
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
          />

          <PerformanceSection
            editableData={editableData}
          />
        </div>

        <TableControls
          handleEdit={handleEdit}
          originalData={originalData}
          setEditableData={setEditableData}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      </div>

      {/* Return to the home page */}
      <button className="back-button" onClick={() => void navigate("/")}>
        ⬅ Back to Catalog
      </button>
    </div>
  );
}
