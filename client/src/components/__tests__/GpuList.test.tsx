// Test dependencies
import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Component
import GpuList from "../GpuList";

// Utils
import createMockContext from "../../test-utils/createMockContext";

// Data
import sampleData from "../../test-utils/data/sampleData";
import GpuContext from "../../Context/GpuContext";

// TypeScript types
import type { GpuInputType } from "../../../../shared/types/types";

// Tests
describe("Testing the Gpu List component", () => {
  describe("empty and filled lists", () => {
    test("the list should be displayed when there are items available", () => {
      // Give an unique ID to each available sample card
      const gpuList = [
        { ...sampleData.rtx5090, id: "rtx5090" },
        { ...sampleData.rx9070xt, id: "rx9070xt" },
        { ...sampleData.rx7900xtx, id: "rx7900xtx" },
        { ...sampleData.gtx650, id: "gtx650" },
        { ...sampleData.b580, id: "b580" },
        { ...sampleData.g210, id: "g210" },
      ];

      const mockContextValue = createMockContext();

      // Create a custom mock version containing the list above
      const mockContextWithCards = {
        ...mockContextValue,
        dataState: {
          ...mockContextValue.dataState,
          gpus: [
            ...gpuList
          ],
        }
      }

      // Render the list component, containing objects
      render(
        <GpuContext.Provider value={mockContextWithCards}>
          <GpuList />
        </GpuContext.Provider>
      );

      // Check if all of the sample cards are present on the page
      for (const gpu of gpuList) {
        expect(
          screen.getByRole("columnheader", {
            name: `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`
          })
        ).toBeInTheDocument();
      }
    });

    test("an empty list should display a proper message", () => {
      const mockContextValue = createMockContext();

      // Render the empty list component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <GpuList />
        </GpuContext.Provider>
      );

      // Assert the message is present on the screen
      expect(screen.getByText(/no gpus available/i)).toBeInTheDocument();
    });
  });
});
