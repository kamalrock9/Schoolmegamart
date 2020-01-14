import * as types from '../actions/actionTypes';

const initialState = {};

export const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.HOME_LAYOUT:
      return action.payload;
    default:
      return state;
  }
};
