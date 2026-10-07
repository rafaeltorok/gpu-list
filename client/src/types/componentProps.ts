import type { GpuType } from "../../../shared/types/types";

export interface UpdateGpuDataProps {
  gpu: GpuType;
  setEditMode: (editMode: boolean) => void;
  editGpu: (gpu: GpuType) => Promise<boolean>;
}
