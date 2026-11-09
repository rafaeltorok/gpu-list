import type { UiState, UiActions } from "../types/context";

export const initialUiState: UiState = {
  searchGpu: "",
  showSearch: false,
  showAll: false,
  showAddForm: false,
  showIndex: false,
  loadingMessage: false,
  notificationMessage: false,
  confirmationMessage: false,
  dialogMessage: "",
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
    case "TOGGLE_LOADING_MESSAGE":
      return {
        ...state,
        loadingMessage: action.payload,
      };
    case "TOGGLE_NOTIFICATION_MESSAGE":
      return {
        ...state,
        notificationMessage: action.payload,
      };
    case "TOGGLE_CONFIRMATION_MESSAGE":
      return {
        ...state,
        confirmationMessage: action.payload,
      };
    case "SET_DIALOG_MESSAGE":
      return {
        ...state,
        dialogMessage: action.payload,
      };
    default:
      return assertNever(action);
  }
};

function assertNever(x: never): never {
  throw new Error("Unexpected action: " + String(x));
}

export default uiReducer;
