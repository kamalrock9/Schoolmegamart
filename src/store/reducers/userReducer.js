import * as types from "../actions/actionTypes";

const initialState = {};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.USER:
      return action.payload;
    case types.UPDATE_USER:
      return {...state, ...action.payload};
    case types.UPDATE_BILLING:
      return {...state, billing: action.payload};
    case types.UPDATE_SHIPPING:
      return {...state, shipping: action.payload};
    case types.LOGOUT:
      return initialState;
    default:
      return state;
  }
};
