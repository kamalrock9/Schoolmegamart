import axios from 'axios';
import Constants from './Config';
import WooCommerce from './WooCommerce';

const instance = axios.create({
  baseURL: Constants.baseURL + '/wp-json/wc/v2',
});

export const getAppSettings = () => {
  return instance.get('/app-settings').then(response => {
    return response.data;
  });
};

export const getProducts = (params = {}) => {
  return instance.get('/custom-products', {params: params}).then(response => {
    return response.data;
  });
};
