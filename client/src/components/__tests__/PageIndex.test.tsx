// Test dependencies
import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
let user: ReturnType<typeof userEvent.setup>;

describe("The PageIndex component", () => {
  describe("testing an opened and closed index", () => {
    beforeEach(() => {
      // Setup the user event
      user = userEvent.setup();
    });

    test("the index should be hidden as default", () => {
      const mockContextValue = createMockContext();

      // Render the page index component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <PageIndex />
        </GpuContext.Provider>,
      );

      // Confirm the button is displaying the correct text
      expect(screen.getByRole("button", { name: /show index/i })).toBeInTheDocument();

      // Confirm the list of index items is not visible by default
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    test("the open index is properly rendered", () => {
      const gpus: GpuType[] = [
        { ...sampleData.rtx5090, id: "rtx5090" },
      ];

      const mockContextValue = createMockContext();

      // Create a new context with a sample card
      const mockContextIndexOpened = {
        ...mockContextValue,
        dataState: {
          ...mockContextValue.dataState,
          gpus: gpus,
        },
        uiState: {
          ...mockContextValue.uiState,
          showIndex: true,
        }
      }

      // Render the page index component
      render(
        <GpuContext.Provider value={mockContextIndexOpened}>
          <PageIndex />
        </GpuContext.Provider>,
      );
      
      // Confirm the button is displaying the correct text
      expect(screen.getByRole("button", { name: /hide index/i })).toBeInTheDocument();

      // Confirm there is a list item present on the index
      const listItem = screen.getByRole("listitem");
      expect(within(listItem).getByRole("button", { name: /nvidia geforce rtx 5090/i })).toBeInTheDocument();
    });
  });
});