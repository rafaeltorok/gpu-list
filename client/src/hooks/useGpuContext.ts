// Context setup
import { useContext } from "react";
import GpuContext from "../Context/GpuContext";

// TypeScript types
import type { GpuContextType } from "../types/context";

export default function useGpuContext(): GpuContextType {
  const context = useContext(GpuContext);

  if (!context) throw new Error("GpuContext must be used within a Provider");

  return context;
}
