import { getInitialData } from ".";
import axios from "../helpers/axios";
import { productConstants } from "./constants";
export const addProduct = (form) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.CREATE_PRODUCT_REQUEST });
    try {
      const res = await axios.post("product/create", form);
      const product = {
        ...res.data.data,
        price: res.data.data.salePrice,
      };
      dispatch({
        type: productConstants.CREATE_PRODUCT_SUCCESS,
        payload: { product },
      });
      dispatch(getInitialData());
    } catch (error) {
      dispatch({
        type: productConstants.CREATE_PRODUCT_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const updateProduct = (id, form) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.UPDATE_PRODUCT_REQUEST });
    try {
      const res = await axios.put(`product/${id}`, form);
      const product = {
        ...res.data.data,
        price: res.data.data.salePrice,
      };
      dispatch({
        type: productConstants.UPDATE_PRODUCT_SUCCESS,
        payload: { product },
      });
      dispatch(getInitialData());
    } catch (error) {
      dispatch({
        type: productConstants.UPDATE_PRODUCT_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const deleteProduct = (id) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.DELETE_PRODUCT_REQUEST });
    try {
      await axios.delete(`product/${id}`);
      dispatch({
        type: productConstants.DELETE_PRODUCT_SUCCESS,
        payload: { id },
      });
      dispatch(getInitialData());
    } catch (error) {
      dispatch({
        type: productConstants.DELETE_PRODUCT_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const getProductById = (id) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.GET_PRODUCT_DETAIL_REQUEST });
    let res;
    try {
      res = await axios.get(`product/${id}`);
      const productDetails = {
        ...res.data.data,
        price: res.data.data.salePrice,
      };
      dispatch({
        type: productConstants.GET_PRODUCT_DETAIL_SUCCESS,
        payload: productDetails,
      });
    } catch (error) {
      dispatch({
        type: productConstants.GET_PRODUCT_DETAIL_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const enableProduct = (id) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.ENABLE_PRODUCT_REQUEST });
    try {
      await axios.put(`product/enable/${id}`);
      dispatch({
        type: productConstants.ENABLE_PRODUCT_SUCCESS,
        payload: { id },
      });
    } catch (error) {
      dispatch({
        type: productConstants.ENABLE_PRODUCT_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
