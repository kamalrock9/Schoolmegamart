'use strict';
import WooCommerceAPI from 'react-native-wc-api';
import Constants from './Config';

const WooCommerce = new WooCommerceAPI({
  url: Constants.baseURL,
  consumerKey: Constants.keys.consumerKey,
  consumerSecret: Constants.keys.consumerSecret,
  wpAPI: true,
  version: 'wc/v3',
  //queryStringAuth: true
});

export default WooCommerce;
