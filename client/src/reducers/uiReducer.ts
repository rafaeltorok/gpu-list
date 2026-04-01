import type { UiState, UiActions } from "../types/context";

export const initialUiState: UiState = {
  searchGpu: "",
  showSearch: false,
  showAll: false,
  showAddForm: false,
  showIndex: false,
};

const uiReducer = (state: UiState, action: UiActions): UiState => {
  switch (action.type) {
    case "SET_SEARCH":
      return {
        ...state,
        searchGpu: action.payload,
      };
    case "TOGGLE_SEARCH":
      return {
        ...state,
        showSearch: !state.showSearch,
      };
    case "TOGGLE_SHOW_ALL":
      return {
        ...state,
        showAll: !state.showAll,
      };
    case "TOGGLE_ADD_FORM":
      return {
        ...state,
        showAddForm: !state.showAddForm,
      };
    case "TOGGLE_INDEX":
      return {
        ...state,
        showIndex: !state.showIndex,
      };
    default:
      return assertNever(action);
  }
};

function assertNever(x: never): never {
  throw new Error("Unexpected action: " + x);
}

export default uiReducer;
