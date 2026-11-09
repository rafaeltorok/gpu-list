import { useState } from "react";
import "../../../styles/AddGpuForm.css";

// Components
import FormRow from "./FormRow";

// TypeScript types
import type { GpuInputType } from "../../../../../shared/types/types";
import type { FormEvent } from "react";

interface AddGpuFormProps {
  createGpu: (gpu: GpuInputType) => Promise<void>;
  onCancel: () => void;
}

export default function AddGpuForm({ createGpu, onCancel }: AddGpuFormProps) {
  const [gpu, setGpu] = useState({
    manufacturer: "",
    gpuline: "",
    model: "",
    cores: "",
    tmus: "",
    rops: "",
    vram: "",
    bus: "",
    memtype: "",
    baseclock: "",
    boostclock: "",
    memclock: "",
  });

  const addGpu = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (
      gpu.manufacturer.trim() === "" ||
      gpu.model.trim() === "" ||
      Number(gpu.cores.trim()) < 1 ||
      Number(gpu.tmus.trim()) < 1 ||
      Number(gpu.rops.trim()) < 1 ||
      Number(gpu.vram.trim()) < 0.016 ||
      Number(gpu.bus.trim()) < 1 ||
      gpu.memtype.trim() === "" ||
      Number(gpu.baseclock.trim()) < 1 ||
      Number(gpu.boostclock.trim()) < 1 ||
      Number(gpu.memclock.trim()) < 0.001
    ) {
      alert("Invalid GPU data");
      return;
    }

    void createGpu({
      manufacturer: gpu.manufacturer.trim(),
      gpuline: gpu.gpuline.trim(),
      model: gpu.model.trim(),
      cores: Number(gpu.cores),
      tmus: Number(gpu.tmus),
      rops: Number(gpu.rops),
      vram: Number(gpu.vram),
      bus: Number(gpu.bus),
      memtype: gpu.memtype.trim(),
      baseclock: Number(gpu.baseclock),
      boostclock: Number(gpu.boostclock),
      memclock: Number(gpu.memclock),
    });

    setGpu({
      manufacturer: "",
      gpuline: "",
      model: "",
      cores: "",
      tmus: "",
      rops: "",
      vram: "",
      bus: "",
      memtype: "",
      baseclock: "",
      boostclock: "",
      memclock: "",
    });

    onCancel();
  };

  return (
    <div>
      <form onSubmit={addGpu} className="add-gpu-form">
        <fieldset className="add-gpu-field">
          <FormRow
            id="manufacturer"
            type="text"
            label="Manufacturer"
            value={gpu.manufacturer}
            placeholder="NVIDIA"
            onChange={(e) => setGpu({ ...gpu, manufacturer: e.target.value })}
          />
          <FormRow
            id="gpuline"
            type="text"
            label="Line"
            value={gpu.gpuline}
            placeholder="GeForce"
            onChange={(e) => setGpu({ ...gpu, gpuline: e.target.value })}
          />
          <FormRow
            id="model"
            type="text"
            label="Model"
            value={gpu.model}
            placeholder="RTX 4090"
            onChange={(e) => setGpu({ ...gpu, model: e.target.value })}
          />
          <FormRow
            id="cores"
            type="number"
            label="Cores"
            value={gpu.cores}
            placeholder="16384"
            onChange={(e) => setGpu({ ...gpu, cores: e.target.value })}
          />
          <FormRow
            id="tmus"
            type="number"
            label="TMUs"
            value={gpu.tmus}
            placeholder="512"
            onChange={(e) => setGpu({ ...gpu, tmus: e.target.value })}
          />
          <FormRow
            id="rops"
            type="number"
            label="ROPs"
            value={gpu.rops}
            placeholder="176"
            onChange={(e) => setGpu({ ...gpu, rops: e.target.value })}
          />
          <FormRow
            id="vram"
            type="number"
            label="VRAM (in GB)"
            value={gpu.vram}
            placeholder="24"
            onChange={(e) => setGpu({ ...gpu, vram: e.target.value })}
            step={"0.01"}
          />
          <FormRow
            id="bus"
            type="number"
            label="Bus Width"
            value={gpu.bus}
            placeholder="384"
            onChange={(e) => setGpu({ ...gpu, bus: e.target.value })}
          />
          <FormRow
            id="memtype"
            type="text"
            label="Memory Type"
            value={gpu.memtype}
            placeholder="GDDR6X"
            onChange={(e) => setGpu({ ...gpu, memtype: e.target.value })}
          />
          <FormRow
            id="baseclock"
            type="number"
            label="Base Clock (MHz)"
            value={gpu.baseclock}
            placeholder="2235"
            onChange={(e) => setGpu({ ...gpu, baseclock: e.target.value })}
          />
          <FormRow
            id="boostclock"
            type="number"
            label="Boost Clock (MHz)"
            value={gpu.boostclock}
            placeholder="2520"
            onChange={(e) => setGpu({ ...gpu, boostclock: e.target.value })}
          />
          <FormRow
            id="memclock"
            type="number"
            label="Memory Clock (MHz)"
            value={gpu.memclock}
            placeholder="21"
            onChange={(e) => setGpu({ ...gpu, memclock: e.target.value })}
            step={"0.001"}
          />
          <div className="form-row">
            <button id="add-gpu-submit-button" type="submit">
              Submit
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
