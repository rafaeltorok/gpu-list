// Vitest dependencies
import { vi } from "vitest";

// TypeScript types
import type { GpuContextType } from "../types/context";

export default function createMockContext() {
  // Mock the React Context
  const mockContextValue: GpuContextType = {
    // Functions: vi.fn() track calls and return promises
    createGpu: vi.fn().mockResolvedValue(true),
    deleteGpu: vi.fn().mockResolvedValue(undefined),
    editGpu: vi.fn().mockResolvedValue(undefined),

    // States
    dataState: {
      gpus: [],
      gpusFound: [],
      loading: false,
      error: null,
    },
    uiState: {
      showAll: false,
      searchGpu: "",
      showSearch: false,
      showAddForm: false,
      showIndex: false,
    },

    // Dispatches
    dataDispatch: vi.fn(),
    uiDispatch: vi.fn(),
  };

  return mockContextValue;
}
