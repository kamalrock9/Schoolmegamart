import {combineReducers} from "redux";
import {homeReducer} from "./homeReducer";
import {categoryReducer} from "./categoryReducer";
import {appSettingsReducer} from "./appSettingsReducer";
import {wishlistReducer} from "./wishlistReducer";
import {cartCountReducer} from "./cartCountReducer";
import {userReducer} from "./userReducer";
import {saveNotification} from "./saveNotification";
import {shippingReducer} from "./shippingReducer";
import {filterReducer} from "./filterCategory";
import {brandReducer} from "./brandReducer";
import {ratingReducer} from "./ratingReducer";

export default combineReducers({
  homeLayout: homeReducer,
  categories: categoryReducer,
  filterCategory: filterReducer,
  brandReducer: brandReducer,
  rating: ratingReducer,
  appSettings: appSettingsReducer,
  wishlist: wishlistReducer,
  cartCount: cartCountReducer,
  user: userReducer,
  saveNotification: saveNotification,
  shipping: shippingReducer,
});
