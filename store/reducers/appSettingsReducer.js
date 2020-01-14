import { APP_SETTINGS } from "../actions/actionTypes";
import { _ } from "lodash";

export const appSettingsReducer = (state = {}, action) => {
    switch (action.type) {
        case APP_SETTINGS:
            return _.isEqual(state, action.payload)
                ? state
                : { ...state, ...action.payload };
        default:
            return state;
    }
};
