import type { DataState, DataActions } from "../types/context";

export const initialDataState: DataState = {
  gpus: [],
  gpusFound: [],
  loading: false,
  error: null,
};

const dataReducer = (state: DataState, action: DataActions): DataState => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        gpus: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
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
    default:
      return assertNever(action);
  }
};

function assertNever(x: never): never {
  throw new Error("Unexpected action: " + x);
}

export default dataReducer;
