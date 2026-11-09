import type React from "react";
import type { GpuType, GpuInputType } from "../../../shared/types/types";

export type UiState = {
  searchGpu: string;
  showSearch: boolean;
  showAll: boolean;
  showAddForm: boolean;
  showIndex: boolean;
  loadingMessage: boolean;
  notificationMessage: boolean;
  confirmationMessage: boolean;
  dialogMessage: string;
};

export type UiActions =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_SEARCH" }
  | { type: "TOGGLE_SHOW_ALL" }
  | { type: "TOGGLE_ADD_FORM" }
  | { type: "TOGGLE_INDEX" }
  | { type: "TOGGLE_LOADING_MESSAGE"; payload: boolean }
  | { type: "TOGGLE_NOTIFICATION_MESSAGE"; payload: boolean }
  | { type: "TOGGLE_CONFIRMATION_MESSAGE"; payload: boolean }
  | { type: "SET_DIALOG_MESSAGE"; payload: string };

export type DataState = {
  gpus: GpuType[];
  gpusFound: GpuType[];
  selectedGpu: GpuType | null;
  loading: boolean;
  error: string | null;
  paginatedData: GpuType[];
};

export type DataActions =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: GpuType[] }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "SET_FOUND"; payload: GpuType[] }
  | { type: "ADD_GPU"; payload: GpuType }
  | { type: "SET_SELECTED_GPU", payload: GpuType | null }
  | { type: "SET_PAGINATED_DATA"; payload: GpuType[] };

export type GpuContextType = {
  createGpu: (gpu: GpuInputType) => Promise<boolean>;
  deleteGpu: () => Promise<void>;
  editGpu: (newData: GpuType) => Promise<boolean>;
  dataState: DataState;
  dataDispatch: React.Dispatch<DataActions>;
  uiState: UiState;
  uiDispatch: React.Dispatch<UiActions>;
};
