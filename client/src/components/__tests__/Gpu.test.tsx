// Test dependencies
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Component
import Gpu from "../Gpu";

// Data
import sampleData from "../../test-utils/data/fixtures";
import GpuContext from "../../context/GpuContext";

// Utils
import calculatePerformance from "../../../../shared/utils/calculatePerformance";

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
describe("Testing the data table component", () => {
  beforeEach(() => {
    // Setup the user event
    user = userEvent.setup();
  });

  describe("valid GPU data", () => {
    test("a valid card is correctly rendered", () => {
      // Get a sample card to test
      const gpu = {
        ...sampleData.rtx5090,
        id: "679a7283008a75d4667c342a", // The actual ID from the MongoDB database
      };

      // Render component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <Gpu gpu={gpu} />
        </GpuContext.Provider>,
      );

      // Find the header by its role and name
      const heading = screen.getByRole("columnheader", {
        name: /nvidia geforce rtx 5090/i,
      });

      expect(heading).toBeInTheDocument();
    });

    test("the VRAM amount measured in MB is properly displayed", async () => {
      // Get a sample card to test
      const gpu = {
        ...sampleData.g210,
        id: "6963dcc3cc4ec5826eef4090", // The actual ID from the MongoDB database
      };

      // Render component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <Gpu gpu={gpu} />
        </GpuContext.Provider>,
      );

      // Format the VRAM amount do be displayed (512MB)
      const vramAmount = gpu.vram * 1000 + "MB";

      // Get the Show button to display all the data
      const showButton = screen.getByRole("button", { name: /show/i });
      await user.click(showButton);

      // Confirm the VRAM amount is displayed in MB
      const vramRow = screen.getByRole("row", { name: /vram/i });
      expect(
        within(vramRow).getByText(`${vramAmount} ${gpu.memtype}`),
      ).toBeInTheDocument();
    });
  });

  describe("invalid GPU data", () => {
    test("the theoretical performance for invalid specifications should be properly handled by the UI", async () => {
      const gpu = {
        ...sampleData.rtx5090,
        cores: 0,
        tmus: -1,
        rops: "",
        bus: true,
      };

      // Calculate the theoretical performance
      // @ts-expect-error
      const performance = calculatePerformance(gpu);

      // Render component
      render(
        <GpuContext.Provider value={mockContextValue}>
          {/* @ts-expect-error */}
          <Gpu gpu={gpu} />
        </GpuContext.Provider>,
      );

      // Get the Show button to display all the data
      const showButton = screen.getByRole("button", { name: /show/i });
      await user.click(showButton);

      // Theoretical performance section
      const fp32Row = screen.getByRole("row", { name: /fp32\(float\)/i });
      expect(within(fp32Row).getByText("N/A")).toBeInTheDocument();
      const textureRateRow = screen.getByRole("row", { name: /texture rate/i });
      expect(within(textureRateRow).getByText("N/A")).toBeInTheDocument();
      const pixelRateRow = screen.getByRole("row", { name: /pixel rate/i });
      expect(within(pixelRateRow).getByText("N/A")).toBeInTheDocument();
      const bandwidthRow = screen.getByRole("row", { name: /bandwidth/i });
      expect(within(bandwidthRow).getByText("N/A")).toBeInTheDocument();
    });
  });

  describe("UI related controls", () => {
    test("the Show toggle display all of the card's data", async () => {
      // Get a sample card to test
      const gpu = {
        ...sampleData.rtx5090,
        id: "679a7283008a75d4667c342a",
      };

      // Calculate the theoretical performance
      const performance = calculatePerformance(gpu);

      // Render component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <Gpu gpu={gpu} />
        </GpuContext.Provider>,
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
      expect(
        within(vramRow).getByText(`${gpu.vram}GB ${gpu.memtype}`),
      ).toBeInTheDocument();
      const busRow = screen.getByRole("row", { name: /bus width/i });
      expect(within(busRow).getByText(`${gpu.bus} bit`)).toBeInTheDocument();

      // Clock speeds
      const baseClockRow = screen.getByRole("row", { name: /base clock/i });
      expect(
        within(baseClockRow).getByText(`${gpu.baseclock} MHz`),
      ).toBeInTheDocument();
      const boostClockRow = screen.getByRole("row", { name: /boost clock/i });
      expect(
        within(boostClockRow).getByText(`${gpu.boostclock} MHz`),
      ).toBeInTheDocument();
      const memClockRow = screen.getByRole("row", { name: /memory clock/i });
      expect(
        within(memClockRow).getByText(`${gpu.memclock} Gbps effective`),
      ).toBeInTheDocument();

      // Theoretical performance
      const fp32Row = screen.getByRole("row", { name: /fp32\(float\)/i });
      expect(within(fp32Row).getByText(performance[0])).toBeInTheDocument();
      const textureRateRow = screen.getByRole("row", { name: /texture rate/i });
      expect(
        within(textureRateRow).getByText(performance[1]),
      ).toBeInTheDocument();
      const pixelRateRow = screen.getByRole("row", { name: /pixel rate/i });
      expect(
        within(pixelRateRow).getByText(performance[2]),
      ).toBeInTheDocument();
      const bandwidthRow = screen.getByRole("row", { name: /bandwidth/i });
      expect(
        within(bandwidthRow).getByText(performance[3]),
      ).toBeInTheDocument();
    });

    test("the Hide toggle hides the card's data", async () => {
      // Get a sample card to test
      const gpu = {
        ...sampleData.rtx5090,
        id: "679a7283008a75d4667c342a",
      };

      // Render component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <Gpu gpu={gpu} />
        </GpuContext.Provider>,
      );

      // Get the Show button to display all the data
      const showButton = screen.getByRole("button", { name: /show/i });
      await user.click(showButton);

      // Confirm the table has been opened
      expect(
        screen.getByRole("row", { name: /specifications/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", { name: /clock speeds/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", { name: /theoretical performance/i }),
      ).toBeInTheDocument();

      // Click on the Hide button
      const hideButton = screen.getByRole("button", { name: /hide/i });
      await user.click(hideButton);

      // Confirm the table sections have been hidden
      expect(
        screen.queryByRole("row", { name: /specifications/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("row", { name: /clock speeds/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("row", { name: /theoretical performance/i }),
      ).not.toBeInTheDocument();
    });

    test("the Show All Data button automatically opens the GPU table", async () => {
      // Get a sample card to test
      const gpu = {
        ...sampleData.rtx5090,
        id: "679a7283008a75d4667c342a",
      };

      // Set the showAll value open all tables on the page
      const mockContextShowAll = {
        ...mockContextValue,
        uiState: {
          ...mockContextValue.uiState,
          showAll: true,
        },
      };

      // Render component
      render(
        <GpuContext.Provider value={mockContextShowAll}>
          <Gpu gpu={gpu} />
        </GpuContext.Provider>,
      );

      // Confirm the table has been opened
      expect(
        screen.getByRole("row", { name: /specifications/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", { name: /clock speeds/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", { name: /theoretical performance/i }),
      ).toBeInTheDocument();
    });
  });

  describe("the Delete button", () => {
    test("clicking on the Delete button triggers a confirm alert message", async () => {
      // Get a sample card to test
      const gpu = {
        ...sampleData.rtx5090,
        id: "679a7283008a75d4667c342a",
      };

      // Mock the alert message
      const alertMessage = vi.spyOn(window, "confirm").mockReturnValue(true);

      // Render component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <Gpu gpu={gpu} />
        </GpuContext.Provider>,
      );

      // Get the Show button to display all the data
      const showButton = screen.getByRole("button", { name: /show/i });
      await user.click(showButton);

      // Click on the Delete button
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      // Confirm the message has been correctly called
      expect(mockContextValue.deleteGpu).toHaveBeenCalledWith(gpu);

      // Clean up
      alertMessage.mockRestore();
    });
  });

  describe("CSS classes", () => {
    test("each of the manufacturer CSS classes are correctly applied", async () => {
      // Get sample cards to test
      const nvidiaGpu = {
        ...sampleData.rtx5090,
        id: "679a7283008a75d4667c342a",
      };

      const amdGpu = {
        ...sampleData.rx7900xtx,
        id: "6799299865f183f803c94e06",
      };

      const intelGpu = {
        ...sampleData.b580,
        id: "6799299865f183f803c94e2c",
      };

      const defaultClassGpu = {
        ...sampleData.rtx5090,
        manufacturer: "Default",
        gpuline: "None",
        model: "Unknown",
        id: "000a0000000a00a0000a000a", // Random non-existing ID
      };

      // Render component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <Gpu gpu={nvidiaGpu} />
          <Gpu gpu={amdGpu} />
          <Gpu gpu={intelGpu} />
          <Gpu gpu={defaultClassGpu} />
        </GpuContext.Provider>,
      );

      // Confirm the classes have been correctly applied to each data table
      const nvidiaHeading = screen.getByRole("columnheader", {
        name: /nvidia geforce rtx 5090/i,
      });
      expect(nvidiaHeading).toHaveClass("nvidia-model-header");

      const amdHeading = screen.getByRole("columnheader", {
        name: /amd radeon rx 7900 xtx/i,
      });
      expect(amdHeading).toHaveClass("amd-model-header");

      const intelHeading = screen.getByRole("columnheader", {
        name: /intel arc b580/i,
      });
      expect(intelHeading).toHaveClass("intel-model-header");

      const defaultHeading = screen.getByRole("columnheader", {
        name: /default none unknown/i,
      });
      expect(defaultHeading).toHaveClass("model-header");
    });
  });
});
