// Test dependencies
import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Component
import GpuList from "../GpuList";

// Utils
import createMockContext from "../../test-utils/createMockContext";

// Data
import sampleData from "../../test-utils/data/fixtures";
import GpuContext from "../../context/GpuContext";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";
import type { GpuContextType } from "../../types/context";

// Global variables
let user: ReturnType<typeof userEvent.setup>;

// Helper functions
function createMockContextWithCards(gpus: GpuType[]): GpuContextType {
  const mockContextValue = createMockContext();

  // Create a custom mock version containing sample cards
  const mockContextWithCards = {
    ...mockContextValue,
    dataState: {
      ...mockContextValue.dataState,
      gpus: [...gpus],
    },
  };

  return mockContextWithCards;
}

// Tests
describe("Testing the Gpu List component", () => {
  describe("empty and filled lists", () => {
    test("the list should be displayed when there are items available", () => {
      // Give an unique ID to each available sample card
      const gpus: GpuType[] = [
        { ...sampleData.rtx5090, id: "rtx5090" },
        { ...sampleData.rx9070xt, id: "rx9070xt" },
        { ...sampleData.rx7900xtx, id: "rx7900xtx" },
        { ...sampleData.gtx650, id: "gtx650" },
        { ...sampleData.b580, id: "b580" },
        { ...sampleData.g210, id: "g210" },
      ];

      const mockContextWithCards = createMockContextWithCards(gpus);

      // Render the list component, containing objects
      render(
        <GpuContext.Provider value={mockContextWithCards}>
          <GpuList />
        </GpuContext.Provider>,
      );

      // Check if all of the sample cards are present on the page
      for (const gpu of gpus) {
        expect(
          screen.getByRole("columnheader", {
            name: `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`,
          }),
        ).toBeInTheDocument();
      }
    });

    test("an empty list should display a proper message", () => {
      const mockContextValue = createMockContext();

      // Render the empty list component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <GpuList />
        </GpuContext.Provider>,
      );

      // Assert the message is present on the screen
      expect(screen.getByText(/no gpus available/i)).toBeInTheDocument();
    });
  });

  describe("the gpu line field", () => {
    beforeEach(() => {
      // Create a list with sample cards
      const gpus: GpuType[] = [
        { ...sampleData.rtx5090, id: "rtx5090" },
        {
          id: "rtxpro6000",
          manufacturer: "NVIDIA",
          gpuline: "",
          model: "RTX PRO 6000 Blackwell",
          cores: 24064,
          tmus: 752,
          rops: 192,
          vram: 96,
          bus: 512,
          memtype: "GDDR7",
          baseclock: 1590,
          boostclock: 2617,
          memclock: 28,
        },
      ];

      const mockContextWithCards = createMockContextWithCards(gpus);

      // Render the list component, containing objects
      render(
        <GpuContext.Provider value={mockContextWithCards}>
          <GpuList />
        </GpuContext.Provider>,
      );
    });

    test("the field should be displayed when available", () => {
      expect(
        screen.getByRole("columnheader", { name: /nvidia geforce rtx 5090/i }),
      ).toBeInTheDocument();
    });

    test("when not available, there should be no whitespaces on its place", () => {
      expect(
        screen.getByRole("columnheader", {
          name: /nvidia rtx pro 6000 blackwell/i,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("filtering the list based on search terms", () => {
    test("only the filtered objects should be displayed", () => {
      // Fetch all available sample cards
      const gpus: GpuType[] = [
        { ...sampleData.rtx5090, id: "rtx5090" },
        { ...sampleData.rx9070xt, id: "rx9070xt" },
        { ...sampleData.rx7900xtx, id: "rx7900xtx" },
        { ...sampleData.gtx650, id: "gtx650" },
        { ...sampleData.b580, id: "b580" },
        { ...sampleData.g210, id: "g210" },
      ];

      // Filter only AMD Radeon cards
      const filteredGpus: GpuType[] = [
        { ...sampleData.rx9070xt, id: "rx9070xt" },
        { ...sampleData.rx7900xtx, id: "rx7900xtx" },
      ];

      const mockContextValue = createMockContext();

      const mockContextFiltered = {
        ...mockContextValue,
        dataState: {
          ...mockContextValue.dataState,
          gpus: gpus,
          gpusFound: filteredGpus,
        },
        uiState: {
          ...mockContextValue.uiState,
          searchGpu: "radeon",
        },
      };

      // Render the list component, containing only the filtered objects
      render(
        <GpuContext.Provider value={mockContextFiltered}>
          <GpuList />
        </GpuContext.Provider>,
      );

      // Confirm there are only two objects being displayed on the list
      expect(screen.getAllByTestId("gpu-data-table").length).toBe(2);

      // Assert only the AMD Radeon cards are present on the list
      expect(
        screen.getByRole("columnheader", {
          name: /amd radeon rx 9070 xt/i,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("columnheader", {
          name: /amd radeon rx 7900 xtx/i,
        }),
      ).toBeInTheDocument();

      // Assert none of the NVIDIA and Intel cards are present
      expect(
        screen.queryByRole("columnheader", {
          name: /nvidia geforce rtx 5090/i,
        }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("columnheader", {
          name: /nvidia geforce gtx 650/i,
        }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("columnheader", {
          name: /intel arc b580/i,
        }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("columnheader", {
          name: /nvidia geforce 210/i,
        }),
      ).not.toBeInTheDocument();
    });

    test("should display a message when no cards have been found", () => {
      // Fetch all available sample cards
      const gpus: GpuType[] = [
        { ...sampleData.rtx5090, id: "rtx5090" },
        { ...sampleData.rx9070xt, id: "rx9070xt" },
        { ...sampleData.rx7900xtx, id: "rx7900xtx" },
        { ...sampleData.gtx650, id: "gtx650" },
        { ...sampleData.b580, id: "b580" },
        { ...sampleData.g210, id: "g210" },
      ];

      const mockContextValue = createMockContext();

      const mockContextFiltered = {
        ...mockContextValue,
        dataState: {
          ...mockContextValue.dataState,
          gpus: gpus,
          gpusFound: [],
        },
        uiState: {
          ...mockContextValue.uiState,
          searchGpu: "none",
        },
      };

      // Render the list component, containing only the filtered objects
      render(
        <GpuContext.Provider value={mockContextFiltered}>
          <GpuList />
        </GpuContext.Provider>,
      );

      // Confirm there are no objects being displayed on the list
      expect(screen.queryAllByTestId("gpu-data-table").length).toBe(0);

      // Assert a message is present on the page
      expect(screen.getByText(/no gpus found/i)).toBeInTheDocument();
    });
  });

  describe("the back to index button", () => {
    beforeEach(() => {
      // Setup the user event
      user = userEvent.setup();
    });

    test("clicking on the button should automatically hide a data table", async () => {
      const gpu: GpuType[] = [{ ...sampleData.rtx5090, id: "rtx5090" }];

      const mockContextWithCards = createMockContextWithCards(gpu);

      render(
        <GpuContext.Provider value={mockContextWithCards}>
          <GpuList />
        </GpuContext.Provider>,
      );

      // Select the entire GPU data section
      const dataTable = screen.getByRole("region", {
        name: /nvidia geforce rtx 5090/i,
      });

      // Click on the Show button to display all the data
      const showButton = within(dataTable).getByRole("button", {
        name: /show/i,
      });
      await user.click(showButton);

      // Confirm the table has been opened
      expect(
        within(dataTable).getByRole("columnheader", {
          name: /specifications/i,
        }),
      ).toBeInTheDocument();
      expect(
        within(dataTable).getByRole("columnheader", { name: /clock speeds/i }),
      ).toBeInTheDocument();
      expect(
        within(dataTable).getByRole("columnheader", {
          name: /theoretical performance/i,
        }),
      ).toBeInTheDocument();

      // Select its respective back to index button
      const backToIndexButton = within(dataTable).getByRole("button", {
        name: /back to index/i,
      });

      await user.click(backToIndexButton);

      // Confirm the table has closed
      expect(
        within(dataTable).queryByRole("columnheader", {
          name: /specifications/i,
        }),
      ).not.toBeInTheDocument();
      expect(
        within(dataTable).queryByRole("columnheader", {
          name: /clock speeds/i,
        }),
      ).not.toBeInTheDocument();
      expect(
        within(dataTable).queryByRole("columnheader", {
          name: /theoretical performance/i,
        }),
      ).not.toBeInTheDocument();
    });
  });
});
