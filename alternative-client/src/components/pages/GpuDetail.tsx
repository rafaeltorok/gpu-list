import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Utils
import getBrand from "../../utils/getBrand";
import calculatePerformance from "../../../../shared/utils/calculatePerformance";
import displayVramAmount from "../../utils/displayVramAmount";

// CSS styles
import "../../styles/GpuDetail.css";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";

interface GpuDetail {
  gpus: GpuType[];
  onDelete: (gpu: GpuType | undefined) => Promise<boolean>;
  handleReturn: (id: string) => void;
}

export default function GpuDetail({ gpus, onDelete, handleReturn }: GpuDetail) {
  const { id } = useParams();
  const navigate = useNavigate();

  const gpu = gpus.find((gpu) => gpu.id === id);

  useEffect(() => {
    const documentObject = document.querySelector(".gpu-detail-container");

    if (documentObject) {
      documentObject.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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

  async function handleDelete() {
    const confirm = await onDelete(gpu);

    if (confirm) {
      void navigate("/");
    }
  }

  const handleReturnCatalog = () => {
    void navigate("/");
    handleReturn(gpu.id);
  };

  const gpuPerformance = calculatePerformance(gpu);

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
          <button className="delete-button" onClick={() => void handleDelete()}>
            Delete GPU
          </button>
        </div>
      </div>
      <button className="back-button" onClick={() => handleReturnCatalog()}>
        ⬅ Back to Catalog
      </button>
    </div>
  );
}
