// Test dependencies
import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

// Component
import Gpu from "../Gpu";

// Data
import sampleData from "../../__tests__/data/sampleData";
import GpuContext from "../../Context/GpuContext";

// Utils
import calculatePerformance from "../../../../shared/utils/calculatePerformance";

// TypeScript types
import type { GpuContextType } from "../../types/context";
import type { GpuType } from "../../../../shared/types/types";

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
let gpu: GpuType;

// Tests
describe("Testing the data table component", () => {
  beforeEach(() => {
    // Setup the user event
    user = userEvent.setup();

    // Get a sample card to test
    gpu = {
      ...sampleData.rtx5090,
      id: "679a7283008a75d4667c342a"  // The actual ID from the MongoDB database
    };
  });

  test("a valid GPU object is correctly rendered", () => {
    // Render component
    render(
      <GpuContext.Provider value={mockContextValue}>
        <Gpu gpu={gpu} />
      </GpuContext.Provider>
    );

    // Find the header by its role and name
    const heading = screen.getByRole("columnheader", { 
      name: /NVIDIA GeForce RTX 5090/i 
    });

    expect(heading).toBeInTheDocument();
  });

  test("the Show toggle display all of the card's data", async () => {
    // Calculate the theoretical performance
    const performance = calculatePerformance(sampleData.rtx5090);

    // Render component
    render(
      <GpuContext.Provider value={mockContextValue}>
        <Gpu gpu={gpu} />
      </GpuContext.Provider>
    );

    // Get the Show button to display all the data
    const showButton = screen.getByRole("button", { name: /show/i });
    await user.click(showButton);

    // Specifications
    const coresRow = screen.getByRole("row", { name: /cores/i });
    expect(within(coresRow).getByText(gpu.cores)).toBeInTheDocument();
    const tmusRow = screen.getByRole("row", { name: /tmus/i });
    expect(within(tmusRow).getByText(gpu.tmus)).toBeInTheDocument();
    const ropsRow = screen.getByRole("row", { name: /rops/i });
    expect(within(ropsRow).getByText(gpu.rops)).toBeInTheDocument();
    const vramRow = screen.getByRole("row", { name: /vram/i });
    expect(within(vramRow).getByText(`${gpu.vram}GB ${gpu.memtype}`)).toBeInTheDocument();
    const busRow = screen.getByRole("row", { name: /bus width/i });
    expect(within(busRow).getByText(`${gpu.bus} bit`)).toBeInTheDocument();

    // Clock speeds
    const baseClockRow = screen.getByRole("row", { name: /base clock/i });
    expect(within(baseClockRow).getByText(`${gpu.baseclock} MHz`)).toBeInTheDocument();
    const boostClockRow = screen.getByRole("row", { name: /boost clock/i });
    expect(within(boostClockRow).getByText(`${gpu.boostclock} MHz`)).toBeInTheDocument();
    const memClockRow = screen.getByRole("row", { name: /memory clock/i });
    expect(within(memClockRow).getByText(`${gpu.memclock} Gbps effective`)).toBeInTheDocument();

    // Theoretical performance
    const fp32Row = screen.getByRole("row", { name: /fp32\(float\)/i });
    expect(within(fp32Row).getByText(performance[0])).toBeInTheDocument();
    const textureRateRow = screen.getByRole("row", { name: /texture rate/i });
    expect(within(textureRateRow).getByText(performance[1])).toBeInTheDocument();
    const pixelRateRow = screen.getByRole("row", { name: /pixel rate/i });
    expect(within(pixelRateRow).getByText(performance[2])).toBeInTheDocument();
    const bandwidthRow = screen.getByRole("row", { name: /bandwidth/i });
    expect(within(bandwidthRow).getByText(performance[3])).toBeInTheDocument();
  });

  test("the Hide toggle hides the card's data", async () => {
    // Render component
    render(
      <GpuContext.Provider value={mockContextValue}>
        <Gpu gpu={gpu} />
      </GpuContext.Provider>
    );

    // Get the Show button to display all the data
    const showButton = screen.getByRole("button", { name: /show/i });
    await user.click(showButton);

    // Confirm the table has been opened
    expect(screen.getByRole("row", { name: /specifications/i })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /clock speeds/i })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /theoretical performance/i })).toBeInTheDocument();

    // Click on the Hide button
    const hideButton = screen.getByRole("button", { name: /hide/i });
    await user.click(hideButton);

    // Confirm the table sections have been hidden
    expect(screen.queryByRole("row", { name: /specifications/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /clock speeds/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /theoretical performance/i })).not.toBeInTheDocument();
  });
});
