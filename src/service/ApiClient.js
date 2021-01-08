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
    // axiosRetry(service, {retries: 3, retryDelay: axiosRetry.exponentialDelay});

    // service.interceptors.request.use(
    //   config => {
    //     config.metadata = {startTime: new Date()};
    //     return config;
    //   },
    //   error => Promise.reject(error),
    // );

    // service.interceptors.response.use(
    //   response => {
    //     response.config.metadata.endTime = new Date();
    //     response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
    //     return response;
    //   },
    //   error => {
    //     error.config.metadata.endTime = new Date();
    //     error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
    //     return Promise.reject(error);
    //   },
    // );

    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  handleSuccess(response) {
    console.log(response);
    return response;
  }

  handleError = error => {
    //console.log(error);

    console.error("Request Failed:", error.config);
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

  // async get(path, params = {}) {
  //   const metric = await perf().newHttpMetric(path, "GET");
  //   await metric.start();
  //   return this.service
  //     .get(path, {params: params})
  //     .then(async res => {
  //       metric.putAttribute("RESPONSE_TIME", res.duration.toString());
  //       metric.setHttpResponseCode(res.status);
  //       await metric.stop();
  //       return res;
  //     })
  //     .catch(async err => {
  //       metric.setHttpResponseCode(0);
  //       await metric.stop();
  //       return err;
  //     });
  // }

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

  // async post(path, payload, extra = {}) {
  //   const metric = await perf().newHttpMetric(path, "POST");
  //   await metric.start();
  //   return this.service
  //     .request({
  //       method: "POST",
  //       url: path,
  //       responseType: "json",
  //       data: payload,
  //       ...extra,
  //     })
  //     .then(async res => {
  //       metric.putAttribute("RESPONSE_TIME", res.duration.toString());
  //       metric.setHttpResponseCode(res.status);
  //       await metric.stop();
  //       return res;
  //     })
  //     .catch(async err => {
  //       metric.setHttpResponseCode(0);
  //       await metric.stop();
  //       return err;
  //     });
  // }

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
