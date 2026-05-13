// Test dependencies
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Component
import ShowAllButton from "../ShowAllButton";

// React Context
import GpuContext from "../../context/GpuContext";

// Test utils
import createMockContext from "../../test-utils/createMockContext";

// Global variables
let user: ReturnType<typeof userEvent.setup>;

// Tests
describe("Testing the show all button", () => {
  test("a true show all state should display a hide button", () => {
    const mockContextValue = createMockContext();

    const mockContextShowAll = {
      ...mockContextValue,
      uiState: {
        ...mockContextValue.uiState,
        showAll: true,
      },
    };

    render(
      <GpuContext.Provider value={mockContextShowAll}>
        <ShowAllButton />
      </GpuContext.Provider>,
    );

    expect(
      screen.getByRole("button", { name: /hide all data/i }),
    ).toBeInTheDocument();
  });

  test("a false show all state should display a show button", () => {
    const mockContextValue = createMockContext();

    render(
      <GpuContext.Provider value={mockContextValue}>
        <ShowAllButton />
      </GpuContext.Provider>,
    );

    expect(
      screen.getByRole("button", { name: /show all data/i }),
    ).toBeInTheDocument();
  });

  test("clicking on the button sends a proper dispatch value", async () => {
    // Setup the user event
    user = userEvent.setup();

    const mockContextValue = createMockContext();

    render(
      <GpuContext.Provider value={mockContextValue}>
        <ShowAllButton />
      </GpuContext.Provider>,
    );

    // Get the button and click it
    const showButton = screen.getByRole("button", { name: /show all data/i });
    await user.click(showButton);

    // Confirm the dispatch function has received the correct value
    expect(mockContextValue.uiDispatch).toHaveBeenCalledWith({
      type: "TOGGLE_SHOW_ALL",
    });
  });
});
