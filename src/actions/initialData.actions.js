import axios from "../helpers/axios";
import { initialDataConstants } from "./constants";

export const getInitialData = () => {
  return async (dispatch) => {
    dispatch({ type: initialDataConstants.GET_INITIALDATA_REQUEST });
    const [initRes] = await Promise.all([axios.get("/getAllIndex")]);
    if (initRes.status === 200) {
      console.log(initRes.data);
      dispatch({
        type: initialDataConstants.GET_INITIALDATA_SUCCESS,
        payload: { indexes: initRes.data },
      });
    }
  };
};

export const importDataWithNewIndex = (data) => {
  return async (dispatch) => {
    const formData = new FormData();
    formData.append("index", data.name);
    formData.append("dataFile", data.file);
    dispatch({ type: initialDataConstants.IMPORT_DATA_WITH_NEW_INDEX_REQUEST });
    axios
      .post("/bulk/data", formData)
      .then(() => {
        dispatch(getInitialData());
      })
      .then(() => {
        dispatch({
          type: initialDataConstants.IMPORT_DATA_WITH_NEW_INDEX_SUCCESS,
        });
      });
  };
};
