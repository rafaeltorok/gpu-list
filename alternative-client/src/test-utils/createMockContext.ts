// Vitest dependencies
import { vi } from "vitest";

// TypeScript types
import type { GpuContextType } from "../types/context";

export default function createMockContext() {
  // Mock the React Context
  const mockContextValue: GpuContextType = {
    // Functions: vi.fn() track calls and return promises
    addGpu: vi.fn().mockResolvedValue(true),
    deleteGpu: vi.fn().mockResolvedValue(undefined),
    editGpu: vi.fn().mockResolvedValue(undefined),

    // States
    dataState: {
      gpus: [],
      gpusFound: [],
      selectedGpu: null,
    },
    uiState: {
      searchTerm: "",
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
