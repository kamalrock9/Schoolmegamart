import * as types from "../actions/actionTypes";

const initialState = {};

export const shippingReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SAVE_SHIPPING:
      return action.payload;
    case types.CHANGE_SHIPPING_COUNTRY:
      return {...state, country: action.payload};
    case types.CHANGE_SHIPPING_STATE:
      return {...state, state: action.payload};
    case types.CHANGE_SHIPPING_CITY:
      return {...state, city: action.payload};
    case types.CHANGE_SHIPPING_PINCODE:
      return {...state, postcode: action.payload};
    default:
      return state;
  }
};
