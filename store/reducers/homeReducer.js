import {
    FETCH_HOME,
    SUCCESS_SUFFIX,
    FAIL_SUFFIX
} from "../actions/actionTypes";

const initialState = {
    loading: false
};
export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_HOME:
            return { ...state, loading: true };
        case FETCH_HOME + SUCCESS_SUFFIX:
            return { ...state, data: action.payload.data, loading: false };
        case FETCH_HOME + FAIL_SUFFIX:
            return { ...state, error: action.error, loading: false };
        default:
            return state;
    }
};
