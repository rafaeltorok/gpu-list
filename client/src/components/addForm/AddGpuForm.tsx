// Component dependencies
import React, { useState } from "react";
import useGpuContext from "../../hooks/useGpuContext";

// React components
import FormRow from "./FormRow";

// CSS Styles
import "../../styles/AddGpuForm.css";

export default function AddGpuForm() {
  const { createGpu, uiState, uiDispatch } = useGpuContext();

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

  const addGpu = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    try {
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
        uiDispatch({
          type: "SET_DIALOG_MESSAGE",
          payload: "Invalid GPU specs",
        });
        uiDispatch({
          type: "TOGGLE_NOTIFICATION_MESSAGE",
          payload: true,
        });
        return;
      }

      // Call the createGpu function to send the API request with the form data
      const response: boolean = await createGpu({
        manufacturer: gpu.manufacturer.trim(),
        gpuline: gpu.gpuline.trim(),
        model: gpu.model.trim(),
        cores: cores,
        tmus: tmus,
        rops: rops,
        vram: vram,
        bus: bus,
        memtype: gpu.memtype.trim(),
        baseclock: base,
        boostclock: boost,
        memclock: memClock,
      });

      // Clear the form data after a successful response
      if (response) {
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
        uiDispatch({
          type: "TOGGLE_ADD_FORM",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      } else {
        console.error(String(err));
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={(event) => {
          void addGpu(event);
        }}
        className="add-gpu-form"
      >
        <button
          className="add-gpu-button"
          type="button"
          onClick={() =>
            uiDispatch({
              type: "TOGGLE_ADD_FORM",
            })
          }
        >
          {uiState.showAddForm ? "Cancel" : "Add Graphics Card"}
        </button>
        {uiState.showAddForm && (
          <fieldset className="add-gpu-field">
            <FormRow
              id="manufacturer"
              type="text"
              label="Manufacturer"
              placeholder="NVIDIA"
              value={gpu.manufacturer}
              onChange={(e) => setGpu({ ...gpu, manufacturer: e.target.value })}
            />
            <FormRow
              id="gpuline"
              type="text"
              label="GPU Line"
              placeholder="GeForce"
              value={gpu.gpuline}
              onChange={(e) => setGpu({ ...gpu, gpuline: e.target.value })}
            />
            <FormRow
              id="model"
              type="text"
              label="Model"
              placeholder="RTX 4090"
              value={gpu.model}
              onChange={(e) => setGpu({ ...gpu, model: e.target.value })}
            />
            <FormRow
              id="cores"
              type="number"
              label="Cores"
              placeholder="16384"
              value={gpu.cores}
              onChange={(e) => setGpu({ ...gpu, cores: e.target.value })}
            />
            <FormRow
              id="tmus"
              type="number"
              label="TMUs"
              placeholder="512"
              value={gpu.tmus}
              onChange={(e) => setGpu({ ...gpu, tmus: e.target.value })}
            />
            <FormRow
              id="rops"
              type="number"
              label="ROPs"
              placeholder="176"
              value={gpu.rops}
              onChange={(e) => setGpu({ ...gpu, rops: e.target.value })}
            />
            <FormRow
              id="vram"
              type="number"
              label="VRAM (GB)"
              placeholder="24"
              value={gpu.vram}
              onChange={(e) => setGpu({ ...gpu, vram: e.target.value })}
              step="0.001"
            />
            <FormRow
              id="bus"
              type="number"
              label="Bus Width (bits)"
              placeholder="384"
              value={gpu.bus}
              onChange={(e) => setGpu({ ...gpu, bus: e.target.value })}
            />
            <FormRow
              id="memtype"
              type="text"
              label="Memory Type"
              placeholder="GDDR6X"
              value={gpu.memtype}
              onChange={(e) => setGpu({ ...gpu, memtype: e.target.value })}
            />
            <FormRow
              id="baseclock"
              type="number"
              label="Base Clock (MHz)"
              placeholder="2235"
              value={gpu.baseclock}
              onChange={(e) => setGpu({ ...gpu, baseclock: e.target.value })}
            />
            <FormRow
              id="boostclock"
              type="number"
              label="Boost Clock (Mhz)"
              placeholder="2520"
              value={gpu.boostclock}
              onChange={(e) => setGpu({ ...gpu, boostclock: e.target.value })}
            />
            <FormRow
              id="memclock"
              type="number"
              label="Memory Clock (Gbps)"
              placeholder="21"
              value={gpu.memclock}
              onChange={(e) => setGpu({ ...gpu, memclock: e.target.value })}
              step="0.01"
            />
            <div className="form-row">
              <button className="add-gpu-submit-button" type="submit">
                Submit
              </button>
            </div>
          </fieldset>
        )}
      </form>
    </div>
  );
}
