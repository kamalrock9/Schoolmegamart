import {
    FETCH_HOME,
    FETCH_CATEGORIES,
    FETCH_CART_COUNT,
    APP_SETTINGS,
    ADD_WISHLIST,
    DELETE_WISHLIST
} from "../actions/actionTypes";

export const getHomeLayout = () => ({
    type: FETCH_HOME,
    payload: {
        request: {
            url: "/layout",
            method: "GET"
        }
    }
});

export const getAllCategories = () => ({
    type: FETCH_CATEGORIES,
    payload: {
        request: {
            url: "/products/all-categories",
            method: "GET"
        }
    }
});
export const getCartCount = () => ({
    type: FETCH_CART_COUNT,
    payload: {
        request: {
            url: "/cart/item-count",
            method: "GET"
        }
    }
});

export const appSettings = data => ({
    type: APP_SETTINGS,
    payload: data
});

export const addWishlist = item => ({
    type: ADD_WISHLIST,
    payload: item
});
export const deleteWishlist = id => ({
    type: DELETE_WISHLIST,
    payload: id
});
