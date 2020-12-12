import {
  FETCH_CART_COUNT,
  SUCCESS_SUFFIX,
  FAIL_SUFFIX,
  DELETE_ITEM_CART,
  CLEAR_CART_COUNT,
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
    case DELETE_ITEM_CART:
      let remain = state - action.payload;
      console.log(remain);
      return remain;
    case CLEAR_CART_COUNT:
      return initialState;
    default:
      return state;
  }
};
