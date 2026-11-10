import { Link } from "react-router-dom";

// Utils
import displayVramAmount from "../../utils/displayVramAmount";
import getBrand from "../../utils/getBrand";

// CSS styles
import "../../styles/GpuCard.css";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";

interface GpuCardProps {
  gpu: GpuType;
}

export default function GpuCard({ gpu }: GpuCardProps) {
  // Match the card color scheme respective to the manufacturer color
  const brand = getBrand(`${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`);

  return (
    <div id={gpu.id}>
      <Link to={`/gpu/${gpu.id}`} className="gpu-card-link">
        <div className={`gpu-card ${brand}`}>
          <div className="gpu-card-header">
            <h2>
              {gpu.manufacturer} {gpu.gpuline}
            </h2>
            <h3>{gpu.model}</h3>
          </div>

          <div className="gpu-card-specs">
            <div className="gpu-card-spec">
              <span className="spec-label">VRAM</span>
              <span className="spec-value">
                {displayVramAmount(gpu.vram)} {gpu.memtype}
              </span>
            </div>
          </div>

          <div className="gpu-card-footer">
            <span className="view-details">View Details</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
