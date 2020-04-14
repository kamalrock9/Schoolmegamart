import * as types from "../actions/actionTypes";

const initialState = [];

export const saveNotification = (state = initialState, action) => {
  switch (action.type) {
    case types.SAVE_NOTIFICATION:
      return [...state, action.payload];
    case types.DELETE_NOTIFICATION:
      const newState = state.filter(item => item.notificationID != action.payload.notificationID);
      return newState;
    default:
      return state;
  }
};
