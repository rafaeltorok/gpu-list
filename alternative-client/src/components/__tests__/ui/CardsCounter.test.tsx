import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Component
import CardsCounter from "../../ui/CardsCounter";

// Mocked context
import GpuContext from "../../../context/GpuContext";

// Data
import sampleData from "../../../test-utils/data/fixturesWithIds";

// TypeScript types
import type { GpuContextType } from "../../../types/context";
import type { GpuType } from "../../../../../shared/types/types";

// Helper functions
export default function createMockContext(gpus: GpuType[], gpusFound: GpuType[], searchTerm: string) {
  // Mock the React Context
  const mockContextValue: GpuContextType = {
    // Functions: vi.fn() track calls and return promises
    addGpu: vi.fn().mockResolvedValue(true),
    deleteGpu: vi.fn().mockResolvedValue(undefined),
    editGpu: vi.fn().mockResolvedValue(undefined),

    // States
    dataState: {
      gpus: gpus,
      gpusFound: gpusFound,
      selectedGpu: null,
    },
    uiState: {
      searchTerm: searchTerm,
      showAddForm: false,
      loadingMessage: false,
      notificationMessage: false,
      confirmationMessage: false,
      dialogMessage: "",
    },

    // Dispatches
    dataDispatch: vi.fn(),
    uiDispatch: vi.fn(),
  };

  return mockContextValue;
}

// Tests
describe("Testing the cards counter for the GPU list", () => {
  describe("component rendering when there are no search terms", () => {
    test("the counter should display the total amount as cards available", () => {
      const gpus: GpuType[] = Object.values(sampleData);
      const mockContextValue = createMockContext(gpus, [], "");

      // Render the component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <CardsCounter />
        </GpuContext.Provider>,
      );

      // Confirm the correct counter is being rendered
      expect(screen.getByText(`Cards available: ${gpus.length}`)).toBeInTheDocument();
    });

    test("should display zero when there are no cards available", () => {
      const mockContextValue = createMockContext([], [], "");

      // Render the component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <CardsCounter />
        </GpuContext.Provider>,
      );

      // Confirm the correct counter is being rendered
      expect(screen.getByText("Cards available: 0")).toBeInTheDocument();
    });

    test("the message should always be on plural, even with a single card available", () => {
      const mockContextValue = createMockContext([ sampleData.rtx5090 ], [], "");

      // Render the component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <CardsCounter />
        </GpuContext.Provider>,
      );

      // Confirm the correct counter is being rendered
      expect(screen.getByText("Cards available: 1")).toBeInTheDocument();
    });
  });

  describe("component rendering when there are search results available", () => {
    test("the counter should display the amount of search results found", () => {
      const gpus: GpuType[] = Object.values(sampleData);
      const gpusFound: GpuType[] = [ sampleData.rtx5090 ];
      const mockContextValue = createMockContext(gpus, gpusFound, "term");

      // Render the component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <CardsCounter />
        </GpuContext.Provider>,
      );

      // Confirm the correct counter is being rendered
      expect(screen.getByText(`Search results: ${gpusFound.length}`)).toBeInTheDocument();
    });

    test("should display zero when no search results were found", () => {
      const gpus: GpuType[] = Object.values(sampleData);
      const mockContextValue = createMockContext(gpus, [], "term");

      // Render the component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <CardsCounter />
        </GpuContext.Provider>,
      );

      // Confirm the correct counter is being rendered
      expect(screen.getByText("Search results: 0")).toBeInTheDocument();
    });

    test("the message should always be on plural, even with a single search result found", () => {
      const gpus: GpuType[] = Object.values(sampleData);
      const mockContextValue = createMockContext(gpus, [ sampleData.rtx5090 ], "term");

      // Render the component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <CardsCounter />
        </GpuContext.Provider>,
      );

      // Confirm the correct counter is being rendered
      expect(screen.getByText("Search results: 1")).toBeInTheDocument();
    });
  });
});
