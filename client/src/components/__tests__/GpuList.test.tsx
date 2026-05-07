// Test dependencies
import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

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
});
