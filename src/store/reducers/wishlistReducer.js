import { ADD_WISHLIST, DELETE_WISHLIST } from '../actions/actionTypes';


export const wishlistReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_WISHLIST:
            return [...state, action.payload];
        case DELETE_WISHLIST:
            return state.filter(item => item.id != action.payload);
        default:
            return state;
    }
}