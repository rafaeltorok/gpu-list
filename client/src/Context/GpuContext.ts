import { createContext } from "react";
import type { GpuContextType } from "../types/context";

const GpuContext = createContext<GpuContextType | null>(null);

export default GpuContext;
