import {BRAND} from "../actions/actionTypes";

const initialState = [];
export const brandReducer = (state = initialState, action) => {
  switch (action.type) {
    case BRAND:
      return action.payload;
    default:
      return state;
  }
};
