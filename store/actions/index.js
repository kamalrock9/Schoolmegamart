import {
  FETCH_HOME,
  FETCH_CATEGORIES,
  FETCH_CART_COUNT,
  APP_SETTINGS,
  ADD_WISHLIST,
  DELETE_WISHLIST,
} from '../actions/actionTypes';

import * as types from './actionTypes';

export const saveHomeLayout = data => ({
  type: types.HOME_LAYOUT,
  payload: data,
});

export const getAllCategories = () => ({
  type: FETCH_CATEGORIES,
  payload: {
    request: {
      url: '/products/all-categories',
      method: 'GET',
    },
  },
});
export const getCartCount = () => ({
  type: FETCH_CART_COUNT,
  payload: {
    request: {
      url: '/cart/item-count',
      method: 'GET',
    },
  },
});

export const saveAppSettings = data => ({
  type: APP_SETTINGS,
  payload: data,
});

export const addWishlist = item => ({
  type: ADD_WISHLIST,
  payload: item,
});
export const deleteWishlist = id => ({
  type: DELETE_WISHLIST,
  payload: id,
});
