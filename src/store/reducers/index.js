import {combineReducers} from "redux";
import {homeReducer} from "./homeReducer";
import {categoryReducer} from "./categoryReducer";
import {appSettingsReducer} from "./appSettingsReducer";
import {wishlistReducer} from "./wishlistReducer";
import {cartCountReducer} from "./cartCountReducer";
import {userReducer} from "./userReducer";
import {saveNotification} from "./saveNotification";

export default combineReducers({
  homeLayout: homeReducer,
  categories: categoryReducer,
  appSettings: appSettingsReducer,
  wishlist: wishlistReducer,
  cartCount: cartCountReducer,
  user: userReducer,
  saveNotification: saveNotification,
});
