import axios from "axios";
import store from "../store";
import { api } from "../urlConfig";

const axiosInstance = axios.create({
  baseURL: api + "",
  headers: {
    Authorization: localStorage.getItem("token") || "",
  },
});
axiosInstance.interceptors.request.use((req) => {
  // const { auth } = store.getState();
  // if (auth.token) {
  //   req.headers.Authorization = `${auth.token}`;
  // }
  return req;
});
axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    // const { status } = error.response;
    // console.log({ error });
    // if (status === 401 || status === 403) {
    //   axios.defaults.headers.common["Authorization"] = "";
    //   // store.dispatch(signout());
    //   // window.location.href = "/";
    // }
    return Promise.reject(error);
  }
);
export default axiosInstance;
