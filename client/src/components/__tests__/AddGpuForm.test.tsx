// Test dependencies
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Component
import AddGpuForm from "../AddGpuForm";

// Data
import sampleData from "../../__tests__/data/sampleData";
import GpuContext from "../../Context/GpuContext";

// TypeScript types
import type { GpuContextType } from "../../types/context";

// Mock the React Context
const mockContextValue: GpuContextType = {
  // Functions: vi.fn() track calls and return promises
  createGpu: vi.fn().mockResolvedValue(true),
  deleteGpu: vi.fn().mockResolvedValue(undefined),

  // States
  dataState: {
    gpus: [],
    gpusFound: [],
    loading: false,
    error: null,
  },
  uiState: {
    showAll: false,
    searchGpu: "",
    showSearch: false,
    showAddForm: false,
    showIndex: false,
  },

  // Dispatches
  dataDispatch: vi.fn(),
  uiDispatch: vi.fn(),
};

// Global variables
let user: ReturnType<typeof userEvent.setup>;

// Tests
describe("Testing the Add Graphics Card form component", () => {
  beforeEach(() => {
    // Setup the user event
    user = userEvent.setup();
  });

  test("the add form input fields are hidden by default", () => {
    // Render the form component
    render(
      <GpuContext.Provider value={mockContextValue}>
        <AddGpuForm />
      </GpuContext.Provider>
    );

    // Select the field set for the input fields
    const formFieldSet = screen.queryByRole("group");

    // Select the Submit button
    const submitButton = screen.queryByRole("button", { name: /submit/i });

    // Confirm the entire input field set is hidden
    expect(formFieldSet).not.toBeInTheDocument();
    
    // Confirm the Submit button is also hidden
    expect(submitButton).not.toBeInTheDocument();
  });

  test("each input field can be typed on", async () => {
    // Get sample data to be used as input
    const gpuData = sampleData.rtx5090;

    // Expand the add form
    const mockContextOpenForm = {
      ...mockContextValue,
      uiState: {
        ...mockContextValue.uiState,
        showAddForm: true,
      }
    };

    // Render the form component
    render(
      <GpuContext.Provider value={mockContextOpenForm}>
        <AddGpuForm />
      </GpuContext.Provider>
    );

    // Select each of the input fields available on the form
    const manufacturerField = screen.getByLabelText(/manufacturer/i, { selector: "input" });
    const gpuLineField = screen.getByLabelText(/gpu line/i, { selector: "input" });
    const modelField = screen.getByLabelText(/model/i, { selector: "input" });
    const coresField = screen.getByLabelText(/cores/i, { selector: "input" });
    const tmusField = screen.getByLabelText(/tmus/i, { selector: "input" });
    const ropsField = screen.getByLabelText(/rops/i, { selector: "input" });
    const vramField = screen.getByLabelText(/vram/i, { selector: "input" });
    const busField = screen.getByLabelText(/bus width/i, { selector: "input" });
    const memTypeField = screen.getByLabelText(/memory type/i, { selector: "input" });
    const baseClockField = screen.getByLabelText(/base clock/i, { selector: "input" });
    const boostClockField = screen.getByLabelText(/boost clock/i, { selector: "input" });
    const memClockField = screen.getByLabelText(/memory clock/i, { selector: "input" });

    // Type on each one of the fields
    await user.type(manufacturerField, gpuData.manufacturer);
    await user.type(gpuLineField, gpuData.gpuline);
    await user.type(modelField, gpuData.model);
    await user.type(coresField, String(gpuData.cores));
    await user.type(tmusField, String(gpuData.tmus));
    await user.type(ropsField, String(gpuData.rops));
    await user.type(vramField, String(gpuData.vram));
    await user.type(busField, String(gpuData.bus));
    await user.type(memTypeField, gpuData.memtype);
    await user.type(baseClockField, String(gpuData.baseclock));
    await user.type(boostClockField, String(gpuData.boostclock));
    await user.type(memClockField, String(gpuData.memclock));

    // Assert the correct input is present on each respective field
    expect(manufacturerField).toHaveValue(gpuData.manufacturer);
    expect(gpuLineField).toHaveValue(gpuData.gpuline);
    expect(modelField).toHaveValue(gpuData.model);
    expect(coresField).toHaveValue(gpuData.cores);
    expect(tmusField).toHaveValue(gpuData.tmus);
    expect(ropsField).toHaveValue(gpuData.rops);
    expect(vramField).toHaveValue(gpuData.vram);
    expect(busField).toHaveValue(gpuData.bus);
    expect(memTypeField).toHaveValue(gpuData.memtype);
    expect(baseClockField).toHaveValue(gpuData.baseclock);
    expect(boostClockField).toHaveValue(gpuData.boostclock);
    expect(memClockField).toHaveValue(gpuData.memclock);
  });

  test("the Submit button works", async () => {
    // Get sample data to be used as input
    const gpuData = sampleData.rtx5090;

    // Expand the add form
    const mockContextOpenForm = {
      ...mockContextValue,
      uiState: {
        ...mockContextValue.uiState,
        showAddForm: true,
      }
    };

    // Render the form component
    render(
      <GpuContext.Provider value={mockContextOpenForm}>
        <AddGpuForm />
      </GpuContext.Provider>
    );

    // Select each of the input fields available on the form
    const manufacturerField = screen.getByLabelText(/manufacturer/i, { selector: "input" });
    const gpuLineField = screen.getByLabelText(/gpu line/i, { selector: "input" });
    const modelField = screen.getByLabelText(/model/i, { selector: "input" });
    const coresField = screen.getByLabelText(/cores/i, { selector: "input" });
    const tmusField = screen.getByLabelText(/tmus/i, { selector: "input" });
    const ropsField = screen.getByLabelText(/rops/i, { selector: "input" });
    const vramField = screen.getByLabelText(/vram/i, { selector: "input" });
    const busField = screen.getByLabelText(/bus width/i, { selector: "input" });
    const memTypeField = screen.getByLabelText(/memory type/i, { selector: "input" });
    const baseClockField = screen.getByLabelText(/base clock/i, { selector: "input" });
    const boostClockField = screen.getByLabelText(/boost clock/i, { selector: "input" });
    const memClockField = screen.getByLabelText(/memory clock/i, { selector: "input" });

    // Fill each one of the fields
    await user.type(manufacturerField, gpuData.manufacturer);
    await user.type(gpuLineField, gpuData.gpuline);
    await user.type(modelField, gpuData.model);
    await user.type(coresField, String(gpuData.cores));
    await user.type(tmusField, String(gpuData.tmus));
    await user.type(ropsField, String(gpuData.rops));
    await user.type(vramField, String(gpuData.vram));
    await user.type(busField, String(gpuData.bus));
    await user.type(memTypeField, gpuData.memtype);
    await user.type(baseClockField, String(gpuData.baseclock));
    await user.type(boostClockField, String(gpuData.boostclock));
    await user.type(memClockField, String(gpuData.memclock));

    // Select the Submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Submit the form
    await user.click(submitButton);

    // Confirm the add function has been called once
    expect(mockContextValue.createGpu).toHaveBeenCalledTimes(1);

    // Confirm the correct data has been passed on to the function
    expect(mockContextValue.createGpu).toHaveBeenCalledWith({ ...gpuData });
  });
});
