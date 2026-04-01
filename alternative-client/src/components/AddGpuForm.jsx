import { useState } from "react";
import PropTypes from "prop-types";

const AddGpuForm = ({ createGpu, onCancel }) => {
  const [gpu, setGpu] = useState({
    manufacturer: "",
    gpuline: "",
    model: "",
    cores: 0,
    tmus: 0,
    rops: 0,
    vram: 0,
    bus: 0,
    memtype: "",
    baseclock: 0,
    boostclock: 0,
    memclock: 0,
  });

  const addGpu = (event) => {
    event.preventDefault();
    createGpu({
      manufacturer: gpu.manufacturer.trim(),
      gpuline: gpu.gpuline.trim(),
      model: gpu.model.trim(),
      cores: gpu.cores,
      tmus: gpu.tmus,
      rops: gpu.rops,
      vram: gpu.vram,
      bus: gpu.bus,
      memtype: gpu.memtype.trim(),
      baseclock: gpu.baseclock,
      boostclock: gpu.boostclock,
      memclock: gpu.memclock,
    });

    setGpu({
      manufacturer: "",
      gpuline: "",
      model: "",
      cores: 0,
      tmus: 0,
      rops: 0,
      vram: 0,
      bus: 0,
      memtype: "",
      baseclock: 0,
      boostclock: 0,
      memclock: 0,
    });

    onCancel();
  };

  function renderRow(label, type, fieldName, placeholder) {
    return (
      <tr>
        <th>
          <label htmlFor={fieldName}>{label}</label>
        </th>
        <td>
          <input
            type={type}
            id={fieldName}
            name={fieldName}
            // Prevents stale data on the React state
            onChange={(event) => {
              const { name, value } = event.target;
              setGpu((prev) => ({ ...prev, [name]: value }));
            }}
            placeholder={placeholder}
          />
        </td>
      </tr>
    );
  }

  return (
    <div>
      <form onSubmit={addGpu} id="add-gpu-form">
        <table id="add-gpu-table">
          <tbody>
            {renderRow("Manufacturer", "text", "manufacturer", "NVIDIA")}
            {renderRow("GPU Line", "text", "gpuline", "GeForce")}
            {renderRow("Model", "text", "model", "RTX 4090")}
            {renderRow("Cores", "number", "cores", "16384")}
            {renderRow("TMUs", "number", "tmus", "512")}
            {renderRow("ROPs", "number", "rops", "176")}
            {renderRow("VRAM (GB)", "number", "vram", "24")}
            {renderRow("Bus Width", "number", "bus", "384")}
            {renderRow("Memory Type", "text", "memtype", "GDDR6X")}
            {renderRow("Base Clock (MHz)", "number", "baseclock", "2235")}
            {renderRow("Boost Clock (MHz)", "number", "boostclock", "2520")}
            {renderRow("Memory Clock (Gbps)", "number", "memclock", "21")}
            <tr className="add-gpu-button-area">
              <td colSpan={2}>
                <button id="add-gpu-submit-button" type="submit">
                  Submit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

AddGpuForm.displayName = "AddGpuForm";

AddGpuForm.propTypes = {
  createGpu: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddGpuForm;
