import {
  FETCH_CART_COUNT,
  SUCCESS_SUFFIX,
  FAIL_SUFFIX
} from "../actions/actionTypes";

const initialState = 0;

export const cartCountReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CART_COUNT:
      return state;
    case FETCH_CART_COUNT + SUCCESS_SUFFIX:
      return state == action.payload.data ? state : action.payload.data;
    case FETCH_CART_COUNT + FAIL_SUFFIX:
      return state;
    default:
      return state;
  }
};
