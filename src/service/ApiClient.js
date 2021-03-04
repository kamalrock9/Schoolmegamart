import React from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import Toast from "react-native-toast-message";
import Constants from "./Config";

class Service {
  constructor() {
    let service = axios.create({
      baseURL: Constants.baseURL + Constants.path,
    });

    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  handleSuccess(response) {
    console.log(response);
    return response;
  }

  handleError = error => {
    //console.log(error);

    console.error("Request Failed:", error);
    if (error.response) {
      Toast.show({
        type: "error",
        text1: "Error",
        position: "bottom",
        text2: error.response.data.toString(),
      });
    } else if (error.message) {
      Toast.show({type: "error", text1: "Error", text2: error.message, position: "bottom"});
    }
    return Promise.reject(error);
  };

  get(path, params = {}) {
    return this.service.get(path, {params: params});
  }

  patch(path, payload) {
    return this.service.request({
      method: "PATCH",
      url: path,
      responseType: "json",
      data: payload,
    });
  }

  post(path, payload, extra = {}) {
    return this.service.request({
      method: "POST",
      url: path,
      responseType: "json",
      data: payload,
      ...extra,
    });
  }

  put(path, payload, extra = {}) {
    return this.service.request({
      method: "PUT",
      url: path,
      responseType: "json",
      data: payload,
      ...extra,
    });
  }
}

export default new Service();
