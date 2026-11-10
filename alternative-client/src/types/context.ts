import type React from "react";
import type { GpuType, GpuInputType } from "../../../shared/types/types";

export type UiState = {
  searchTerm: string;
  showAddForm: boolean;
  loadingMessage: boolean;
  notificationMessage: boolean;
  confirmationMessage: boolean;
  dialogMessage: string;
};

export type UiActions =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "TOGGLE_ADD_FORM" }
  | { type: "TOGGLE_LOADING_MESSAGE"; payload: boolean }
  | { type: "TOGGLE_NOTIFICATION_MESSAGE"; payload: boolean }
  | { type: "TOGGLE_CONFIRMATION_MESSAGE"; payload: boolean }
  | { type: "SET_DIALOG_MESSAGE"; payload: string };

export type DataState = {
  gpus: GpuType[];
  gpusFound: GpuType[];
  selectedGpu: GpuType | null;
};

export type DataActions =
  | { type: "SET_GPUS"; payload: GpuType[] }
  | { type: "SET_FOUND"; payload: GpuType[] }
  | { type: "ADD_GPU"; payload: GpuType }
  | { type: "SET_SELECTED_GPU"; payload: GpuType | null };

export type GpuContextType = {
  addGpu: (gpu: GpuInputType) => Promise<void>;
  deleteGpu: () => Promise<void>;
  // editGpu: (newData: GpuType) => Promise<boolean>;
  dataState: DataState;
  dataDispatch: React.Dispatch<DataActions>;
  uiState: UiState;
  uiDispatch: React.Dispatch<UiActions>;
};
