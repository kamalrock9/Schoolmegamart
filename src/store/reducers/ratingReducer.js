import {RATING} from "../actions/actionTypes";

const initialState = [];
export const ratingReducer = (state = initialState, action) => {
  switch (action.type) {
    case RATING:
      return action.payload;
    default:
      return state;
  }
};
