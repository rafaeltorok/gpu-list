import type { DataState, DataActions } from "../types/context";

export const initialDataState: DataState = {
  gpus: [],
  gpusFound: [],
  selectedGpu: null,
};

const dataReducer = (state: DataState, action: DataActions) => {
  switch (action.type) {
    case "SET_GPUS":
      return {
        ...state,
        gpus: action.payload,
      };
    case "SET_FOUND":
      return {
        ...state,
        gpusFound: action.payload,
      };
    case "ADD_GPU":
      return {
        ...state,
        gpus: [...state.gpus, action.payload],
      };
    case "SET_SELECTED_GPU":
      return {
        ...state,
        selectedGpu: action.payload,
      };
    default:
      return assertNever(action);
  }
};

function assertNever(x: never): never {
  throw new Error("Unexpected action: " + String(x));
}

export default dataReducer;
