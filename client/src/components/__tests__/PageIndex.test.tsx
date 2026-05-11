// Test dependencies
import { describe, test, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";

// Component
import PageIndex from "../PageIndex";

// Utils
import createMockContext from "../../test-utils/createMockContext";

// Data
import sampleData from "../../test-utils/data/fixtures";
import GpuContext from "../../context/GpuContext";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";

// Global variables
const gpus: GpuType[] = [
  { ...sampleData.rtx5090, id: "rtx5090" },
  { ...sampleData.rx9070xt, id: "rx9070xt" },
  { ...sampleData.rx7900xtx, id: "rx7900xtx" },
  { ...sampleData.gtx650, id: "gtx650" },
  { ...sampleData.b580, id: "b580" },
  { ...sampleData.g210, id: "g210" },
];

// Tests
describe("The PageIndex component", () => {
  describe("testing basic index rendering", () => {
    test("the index should be hidden as default", () => {
      const mockContextValue = createMockContext();

      // Render the page index component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <PageIndex />
        </GpuContext.Provider>,
      );

      // Confirm the button is displaying the correct text
      expect(
        screen.getByRole("button", { name: /show index/i }),
      ).toBeInTheDocument();

      // Confirm the list of index items is not visible by default
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    test("an open index is properly displayed", () => {
      const gpu: GpuType[] = [{ ...sampleData.rtx5090, id: "rtx5090" }];

      const mockContextValue = createMockContext();

      // Create a new context with a sample card
      const mockContextIndexOpened = {
        ...mockContextValue,
        dataState: {
          ...mockContextValue.dataState,
          gpus: gpu,
        },
        uiState: {
          ...mockContextValue.uiState,
          showIndex: true,
        },
      };

      // Render the page index component
      render(
        <GpuContext.Provider value={mockContextIndexOpened}>
          <PageIndex />
        </GpuContext.Provider>,
      );

      // Confirm the button is displaying the correct text
      expect(
        screen.getByRole("button", { name: /hide index/i }),
      ).toBeInTheDocument();

      // Confirm there is a list item present on the index
      const listItem = screen.getByRole("listitem");
      expect(
        within(listItem).getByRole("button", {
          name: /nvidia geforce rtx 5090/i,
        }),
      ).toBeInTheDocument();
    });

    test("the index should be empty when there are no cards available", () => {
      // Create a context with no available cards
      const mockContextValue = createMockContext();

      // Create a new context with an opened index
      const mockContextIndexOpened = {
        ...mockContextValue,
        uiState: {
          ...mockContextValue.uiState,
          showIndex: true,
        },
      };

      // Render the page index component
      render(
        <GpuContext.Provider value={mockContextIndexOpened}>
          <PageIndex />
        </GpuContext.Provider>,
      );

      // Confirm there are no index items
      expect(screen.queryAllByRole("listitem").length).toBe(0);
    });
  });

  describe("the search functionality", () => {
    test("the index should be filtered based on the search term", () => {
      const gpusFound: GpuType[] = [
        { ...sampleData.rx9070xt, id: "rx9070xt" },
        { ...sampleData.rx7900xtx, id: "rx7900xtx" },
      ];

      const mockContextValue = createMockContext();

      // Create a new context with sample cards
      const mockContextIndexOpened = {
        ...mockContextValue,
        dataState: {
          ...mockContextValue.dataState,
          gpus: gpus,
          gpusFound: gpusFound,
        },
        uiState: {
          ...mockContextValue.uiState,
          showIndex: true,
          searchGpu: "radeon",
        },
      };

      // Render the page index component
      render(
        <GpuContext.Provider value={mockContextIndexOpened}>
          <PageIndex />
        </GpuContext.Provider>,
      );

      // Confirm it contains only the cards found
      expect(
        screen.getByRole("button", { name: /amd radeon rx 9070 xt/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /amd radeon rx 7900 xtx/i }),
      ).toBeInTheDocument();
    });

    test("an empty search term should display all index items", () => {
      const gpusFound: GpuType[] = [
        { ...sampleData.rx9070xt, id: "rx9070xt" },
        { ...sampleData.rx7900xtx, id: "rx7900xtx" },
      ];

      const mockContextValue = createMockContext();

      // Create a new context with sample cards
      const mockContextIndexOpened = {
        ...mockContextValue,
        dataState: {
          ...mockContextValue.dataState,
          gpus: gpus,
          gpusFound: gpusFound,
        },
        uiState: {
          ...mockContextValue.uiState,
          showIndex: true,
          searchGpu: "",
        },
      };

      // Render the page index component
      render(
        <GpuContext.Provider value={mockContextIndexOpened}>
          <PageIndex />
        </GpuContext.Provider>,
      );

      // Confirm it contains all the items
      expect(
        screen.getByRole("button", { name: /nvidia geforce rtx 5090/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /amd radeon rx 9070 xt/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /amd radeon rx 7900 xtx/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /nvidia geforce gtx 650/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /intel arc b580/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /nvidia geforce 210/i }),
      ).toBeInTheDocument();
    });

    test("the index list should be empty if no cards are found", () => {
      const mockContextValue = createMockContext();

      // Create a new context with sample cards
      const mockContextIndexOpened = {
        ...mockContextValue,
        dataState: {
          ...mockContextValue.dataState,
          gpus: gpus,
          gpusFound: [],
        },
        uiState: {
          ...mockContextValue.uiState,
          showIndex: true,
          searchGpu: "none",
        },
      };

      // Render the page index component
      render(
        <GpuContext.Provider value={mockContextIndexOpened}>
          <PageIndex />
        </GpuContext.Provider>,
      );

      // Confirm it contains no item list
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });
});
