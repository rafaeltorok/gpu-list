import { useState } from "react";
import useGpuContext from "../../../hooks/useGpuContext";
import "../../../styles/AddGpuForm.css";

// Components
import FormRow from "./FormRow";

// TypeScript types
import type { FormEvent } from "react";

export default function AddGpuForm() {
  const { addGpu, uiDispatch } = useGpuContext();
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

  // Handles submitting the form data
  async function handleCreateGpu(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const cores = Number(gpu.cores.trim());
    const tmus = Number(gpu.tmus.trim());
    const rops = Number(gpu.rops.trim());
    const vram = Number(gpu.vram.trim());
    const bus = Number(gpu.bus.trim());
    const base = Number(gpu.baseclock.trim());
    const boost = Number(gpu.boostclock.trim());
    const memClock = Number(gpu.memclock.trim());

    // Validate each field before the API request
    if (
      gpu.manufacturer.trim() === "" ||
      gpu.model.trim() === "" ||
      gpu.memtype.trim() === "" ||
      !Number.isInteger(cores) ||
      !Number.isInteger(tmus) ||
      !Number.isInteger(rops) ||
      !Number.isInteger(bus) ||
      !Number.isInteger(base) ||
      !Number.isInteger(boost) ||
      cores < 1 ||
      tmus < 1 ||
      rops < 1 ||
      vram < 0.001 ||
      bus < 1 ||
      base < 1 ||
      boost < 1 ||
      memClock < 0.01
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

    // Call the main App component function responsible for making the API call
    const isSuccess = await addGpu({
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

    // Reset the form data on success
    if (isSuccess) {
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
    }
  }

  return (
    <div>
      <form onSubmit={(e) => void handleCreateGpu(e)} className="add-gpu-form">
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
            step={"0.001"}
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
            step={"0.01"}
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
