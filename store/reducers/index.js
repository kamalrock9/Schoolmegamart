import {combineReducers} from "redux";
import {homeReducer} from "./homeReducer";
import {categoryReducer} from "./categoryReducer";
import {appSettingsReducer} from "./appSettingsReducer";
import {wishlistReducer} from "./wishlistReducer";
import {cartCountReducer} from "./cartCountReducer";

export default combineReducers({
    homeLayout: homeReducer,
    categories: categoryReducer,
    appSettings: appSettingsReducer,
    wishlist: wishlistReducer,
    cartCount: cartCountReducer
});
