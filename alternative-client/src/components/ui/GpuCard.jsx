import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import getBrand from "../../utils/getBrand";
import displayVramAmount from "../../utils/displayVramAmount";

import "../../styles/GpuCard.css";

function GpuCard({ gpu }) {
  return (
    <div id={gpu.id}>
      <Link to={`/gpu/${gpu.id}`} className="gpu-card-link">
        <div className={`gpu-card ${getBrand(gpu)}`}>
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

GpuCard.propTypes = {
  gpu: PropTypes.shape({
    id: PropTypes.string.isRequired,
    manufacturer: PropTypes.string.isRequired,
    gpuline: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    cores: PropTypes.number.isRequired,
    tmus: PropTypes.number.isRequired,
    rops: PropTypes.number.isRequired,
    vram: PropTypes.number.isRequired,
    bus: PropTypes.number.isRequired,
    memtype: PropTypes.string.isRequired,
    baseclock: PropTypes.number.isRequired,
    boostclock: PropTypes.number.isRequired,
    memclock: PropTypes.number.isRequired,
  }).isRequired,
};

export default GpuCard;
