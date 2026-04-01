import type { GpuType, GpuInputType } from "./gpu";

export type UiState = {
  searchGpu: string;
  showSearch: boolean;
  showAll: boolean;
  showAddForm: boolean;
  showIndex: boolean;
};

export type UiActions =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_SEARCH" }
  | { type: "TOGGLE_SHOW_ALL" }
  | { type: "TOGGLE_ADD_FORM" }
  | { type: "TOGGLE_INDEX" };

export type DataState = {
  gpus: GpuType[];
  gpusFound: GpuType[];
  loading: boolean;
  error: string | null;
};

export type DataActions =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: GpuType[] }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "SET_FOUND"; payload: GpuType[] }
  | { type: "ADD_GPU"; payload: GpuType };

export type GpuContextType = {
  createGpu: (gpu: GpuInputType) => Promise<boolean>;
  deleteGpu: (gpu: GpuType) => Promise<void>;
  dataState: DataState;
  dataDispatch: React.Dispatch<DataActions>;
  uiState: UiState;
  uiDispatch: React.Dispatch<UiActions>;
};
