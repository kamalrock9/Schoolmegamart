import * as types from '../actions/actionTypes';

const initialState = {};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.USER:
      return action.payload;
    default:
      return state;
  }
};
