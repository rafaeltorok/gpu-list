import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGpuContext from "../../hooks/useGpuContext";

// Utils
import getBrand from "../../utils/getBrand";
import calculatePerformance from "../../../../shared/utils/calculatePerformance";
import displayVramAmount from "../../utils/displayVramAmount";

// CSS styles
import "../../styles/GpuDetail.css";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";

export default function GpuDetail() {
  const { dataState, dataDispatch, uiDispatch } = useGpuContext();
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the respective card from the list based on its ID value
  const gpu = dataState.gpus.find((gpu: GpuType) => gpu.id === id);

  // Scroll to the top of the data table when a user selects a card form the list
  useEffect(() => {
    const documentObject = document.querySelector(".gpu-detail-container");

    if (documentObject) {
      documentObject.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Display a proper message when a card is not found
  if (!gpu) {
    return (
      <div className="gpu-detail-container">
        <h2>GPU Not Found</h2>
        <button className="back-button" onClick={() => void navigate("/")}>
          ⬅ Back to Catalog
        </button>
      </div>
    );
  }

  // Calculate the Theoretical performance for the current card
  const gpuPerformance = calculatePerformance(gpu);

  // Set the table color scheme to the respective manufacturer color
  const brand = getBrand(`${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`);

  return (
    <div className="gpu-detail-container">
      <div className={`gpu-detail-card ${brand}`}>
        <div className="gpu-detail-header">
          <h1>
            {gpu.manufacturer} {gpu.gpuline} {gpu.model}
          </h1>
        </div>

        <div className="gpu-detail-content">
          <div className="gpu-detail-section">
            <h2>Specifications</h2>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Cores</span>
                <span className="spec-value">{gpu.cores}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">TMUs</span>
                <span className="spec-value">{gpu.tmus}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">ROPs</span>
                <span className="spec-value">{gpu.rops}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">VRAM</span>
                <span className="spec-value">
                  {displayVramAmount(gpu.vram)} {gpu.memtype}
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Bus Width</span>
                <span className="spec-value">{gpu.bus} bit</span>
              </div>
            </div>
          </div>

          <div className="gpu-detail-section">
            <h2>Clock Speeds</h2>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Base Clock</span>
                <span className="spec-value">{gpu.baseclock} MHz</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Boost Clock</span>
                <span className="spec-value">{gpu.boostclock} MHz</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Memory Clock</span>
                <span className="spec-value">{gpu.memclock} Gbps</span>
              </div>
            </div>
          </div>

          <div className="gpu-detail-section">
            <h2>Performance</h2>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">FP32</span>
                <span className="spec-value">{gpuPerformance[0]}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Texture Rate</span>
                <span className="spec-value">{gpuPerformance[1]}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Pixel Rate</span>
                <span className="spec-value">{gpuPerformance[2]}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Bandwidth</span>
                <span className="spec-value">{gpuPerformance[3]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="gpu-detail-actions">
          <button
            className="delete-button"
            onClick={() => {
              dataDispatch({
                type: "SET_SELECTED_GPU",
                payload: gpu,
              });
              uiDispatch({
                type: "SET_DIALOG_MESSAGE",
                payload: `Remove ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model} from the list?`,
              });
              uiDispatch({
                type: "TOGGLE_CONFIRMATION_MESSAGE",
                payload: true,
              });
            }}
          >
            Delete GPU
          </button>
        </div>
      </div>
      <button className="back-button" onClick={() => void navigate("/")}>
        ⬅ Back to Catalog
      </button>
    </div>
  );
}
