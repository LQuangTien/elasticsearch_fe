import { initialDataConstants } from "../actions/constants";

const initState = {
  isIniting: false,
  indexes: null,
  isImportDataWithNewIndex: false,
};

const initReducer = (state = initState, action) => {
  switch (action.type) {
    case initialDataConstants.GET_INITIALDATA_REQUEST:
      state = {
        ...state,
        isIniting: true,
      };
      break;
    case initialDataConstants.GET_INITIALDATA_SUCCESS:
      state = {
        ...state,
        isIniting: false,
        indexes: action.payload.indexes,
      };
      break;
    case initialDataConstants.IMPORT_DATA_WITH_NEW_INDEX_REQUEST:
      state = {
        ...state,
        isImportDataWithNewIndex: true,
      };
      break;
    case initialDataConstants.IMPORT_DATA_WITH_NEW_INDEX_SUCCESS:
      state = {
        ...state,
        isImportDataWithNewIndex: false,
      };
      break;
    default:
      break;
  }
  return state;
};
export default initReducer;
