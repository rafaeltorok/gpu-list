// Test dependencies
import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

// Component
import SearchBar from "../SearchBar";

// React Context
import GpuContext from "../../context/GpuContext";

// Test utils
import createMockContext from "../../test-utils/createMockContext";

// TypeScript types
import type { ReactNode } from "react";
import type { UiActions } from "../../types/context";
type TestProviderProps = {
  children: ReactNode;
};

// Global variables
let user: ReturnType<typeof userEvent.setup>;

// Helper functions
function TestProvider({ children }: TestProviderProps) {
  const mockContext = createMockContext();

  // Open the search bar
  const [uiState, setUiState] = useState({
    ...mockContext.uiState,
    showSearch: true,
  });

  // Create a mock dispatch to handle the input state
  const uiDispatch = (action: UiActions) => {
    if (action.type === "SET_SEARCH") {
      setUiState((prev) => ({
        ...prev,
        searchGpu: action.payload,
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
  describe("basic UI rendering", () => {
    test("the search bar is hidden by default", () => {
      const mockContextValue = createMockContext();

      render(
        <GpuContext.Provider value={mockContextValue}>
          <SearchBar />
        </GpuContext.Provider>,
      );

      // Confirm the open button is present
      expect(
        screen.getByRole("button", { name: /search/i }),
      ).toBeInTheDocument();

      // Assert the input field is hidden
      expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
    });

    test("renders the input field when showSearch is true", () => {
      const mockContextValue = createMockContext();

      const mockContextOpenSearchBar = {
        ...mockContextValue,
        uiState: {
          ...mockContextValue.uiState,
          showSearch: true,
        },
      };

      render(
        <GpuContext.Provider value={mockContextOpenSearchBar}>
          <SearchBar />
        </GpuContext.Provider>,
      );

      // Confirm the button to hide the bar is present
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();

      // Assert the input field is visible
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    test("the input field can be typed on", async () => {
      // Setup the user event
      user = userEvent.setup();

      // Render the page index component
      render(
        <TestProvider>
          <SearchBar />
        </TestProvider>,
      );

      // Find the search input field and fill it
      const searchField = screen.getByPlaceholderText(/search/i);
      await user.type(searchField, "nvidia");

      expect(searchField).toHaveValue("nvidia");
    });
  });

  describe("the react context dispatch function", () => {
    beforeEach(() => {
      user = userEvent.setup();
    });

    test("the search button should send a toggle dispatch call", async () => {
      const mockContextValue = createMockContext();

      // Render the page index component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <SearchBar />
        </GpuContext.Provider>,
      );

      // Find and click on the show index button
      const searchButton = screen.getByRole("button", { name: /search/i });
      await user.click(searchButton);

      // Assert the toggle dispatch is correct
      expect(mockContextValue.uiDispatch).toHaveBeenCalledWith({
        type: "TOGGLE_SEARCH",
      });
    });

    test("the cancel button should send a toggle dispatch call", async () => {
      const mockContextValue = createMockContext();

      // Create a new context with an open index
      const mockContextOpenSearchBar = {
        ...mockContextValue,
        uiState: {
          ...mockContextValue.uiState,
          showSearch: true,
        },
      };

      // Render the page index component
      render(
        <GpuContext.Provider value={mockContextOpenSearchBar}>
          <SearchBar />
        </GpuContext.Provider>,
      );

      // Find and click on the hide index button
      const hideButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(hideButton);

      // Assert the toggle dispatch is correct
      expect(mockContextOpenSearchBar.uiDispatch).toHaveBeenCalledWith({
        type: "TOGGLE_SEARCH",
      });
    });
  });
});
