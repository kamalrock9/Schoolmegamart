import * as types from "./actionTypes";

export const saveHomeLayout = data => ({
  type: types.HOME_LAYOUT,
  payload: data,
});

export const getAllCategories = () => ({
  type: types.FETCH_CATEGORIES,
  payload: {
    request: {
      url: "/products/all-categories",
      method: "GET",
    },
  },
});
export const getCartCount = () => ({
  type: types.FETCH_CART_COUNT,
  payload: {
    request: {
      url: "/cart/item-count",
      method: "GET",
    },
  },
});

export const saveAppSettings = data => ({
  type: types.APP_SETTINGS,
  payload: data,
});

export const addWishlist = item => ({
  type: types.ADD_WISHLIST,
  payload: item,
});
export const deleteWishlist = id => ({
  type: types.DELETE_WISHLIST,
  payload: id,
});

export const user = data => ({
  type: types.USER,
  payload: data,
});

export const logout = data => ({
  type: types.LOGOUT,
  payload: data,
});

export const updateUser = data => ({
  type: types.UPDATE_USER,
  payload: data,
});

export const updateBilling = data => ({
  type: types.UPDATE_BILLING,
  payload: data,
});

export const updateShipping = data => ({
  type: types.UPDATE_SHIPPING,
  payload: data,
});

export const saveNotification = data => ({
  type: types.SAVE_NOTIFICATION,
  payload: data,
});

export const deleteNotification = data => ({
  type: types.DELETE_NOTIFICATION,
  payload: data,
});
