import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { useState } from "react";

// Component
import SearchBar from "../../ui/SearchBar";

// Mocked Context
import GpuContext from "../../../context/GpuContext";
import createMockContext from "../../../test-utils/createMockContext";

// TypeScript types
import type { GpuContextType } from "../../../types/context";
import type { ReactNode } from "react";
import type { UiActions } from "../../../types/context";
type TestProviderProps = {
  children: ReactNode;
};

// Global variables
let user: ReturnType<typeof userEvent.setup>;

// Helper functions
function TestProvider({ children }: TestProviderProps) {
  const mockContext: GpuContextType = createMockContext();

  // Create a mock of the UI state
  const [uiState, setUiState] = useState({
    ...mockContext.uiState,
  });

  // Create a mock dispatch to handle the input state
  const uiDispatch = (action: UiActions) => {
    if (action.type === "SET_SEARCH_TERM") {
      setUiState((prev) => ({
        ...prev,
        searchTerm: action.payload,
      }));
    }
  };

  // Return the custom provider
  return (
    <GpuContext.Provider
      value={{
        ...mockContext,
        uiState,
        uiDispatch,
      }}
    >
      {children}
    </GpuContext.Provider>
  );
}

// Tests
describe("Testing the Search Bar component", () => {
  describe("basic search bar functionality", () => {
    test("the input field should be rendered", () => {
      render(
        <TestProvider>
          <BrowserRouter>
            <SearchBar />
          </BrowserRouter>
        </TestProvider>,
      );

      // Assert the input field is visible
      expect(screen.getByPlaceholderText(/search gpus/i)).toBeInTheDocument();
    });

    test("the input field can be typed on", async () => {
      // Setup the user event
      user = userEvent.setup();

      // Render the page index component
      render(
        <TestProvider>
          <BrowserRouter>
            <SearchBar />
          </BrowserRouter>
        </TestProvider>,
      );

      // Find the search input field and fill it
      const searchField = screen.getByPlaceholderText(/search gpus/i);
      await user.type(searchField, "nvidia");

      // Assert the correct search term is present within it
      expect(searchField).toHaveValue("nvidia");
    });
  });
});
