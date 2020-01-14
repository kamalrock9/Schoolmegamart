import axios from "axios";
import Constants from "./Config";
import WooCommerce from "./WooCommerce";

const instance = axios.create({
  baseURL: Constants.baseURL + "/wp-json/wc/v2"
});

export const getAppSettings = () => {
  return instance.get("/app-settings").then(response => {
    return response.data;
  });
};

export const getProducts = (params = {}) => {
  return instance.get("/custom-products", { params: params }).then(response => {
    return response.data;
  });
};

export const getProductById = (include, id) => {
  //Multiple ids suppoerted(include=1,2,3,4,5) or single id supported(id=1)
  let incl = include ? "?include=" + include : "";
  let i = id ? "?id=" + id : "";
  return instance.get("/get-products-by-id" + incl + i).then(response => {
    return response.data;
  });
};

//Cart Sesstions
export const addCart = data => {
  return instance.post("/cart/add", data).then(response => {
    return response.data;
  });
};
export const getCart = () => {
  return instance.get("/cart").then(response => {
    return response.data;
  });
};
