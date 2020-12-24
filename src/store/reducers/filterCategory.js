import {FILTER_CATEGORY} from "../actions/actionTypes";

const initialState = [];
export const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case FILTER_CATEGORY:
      console.log(action.payload);
      return action.payload;
    default:
      return state;
  }
};
