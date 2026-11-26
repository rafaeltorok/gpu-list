// Vitest dependencies
import { vi } from "vitest";

// TypeScript types
import type { GpuContextType } from "../types/context";
import type { GpuType } from "../../../shared/types/types";

export default function createMockContext(gpus?: GpuType[], gpusFound?: GpuType[], searchTerm?: string) {
  // Mock the React Context
  const mockContextValue: GpuContextType = {
    // Functions: vi.fn() track calls and return promises
    addGpu: vi.fn().mockResolvedValue(true),
    deleteGpu: vi.fn().mockResolvedValue(undefined),
    editGpu: vi.fn().mockResolvedValue(undefined),

    // States
    dataState: {
      gpus: gpus || [],
      gpusFound: gpusFound || [],
      selectedGpu: null,
    },
    uiState: {
      searchTerm: searchTerm || "",
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
