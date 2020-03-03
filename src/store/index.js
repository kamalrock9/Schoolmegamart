import {createStore, applyMiddleware, compose} from "redux";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import rootReducer from "./reducers";
import {persistStore, persistReducer} from "redux-persist";
import autoMergeLevel1 from "redux-persist/lib/stateReconciler/autoMergeLevel1";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "service/Config";

const client = axios.create({
  //all axios can be used, shown in axios documentation
  baseURL: Constants.baseURL + "/wp-json/wc/v2",
  responseType: "json",
});

const persistConfig = {
  key: "wooapp",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel1, // see "Merge Process" section for details.
  keyPrefix: "react",
  version: 1,
  timeout: 0, //can be removed when not debuging
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  pReducer,
  composeEnhancers(applyMiddleware(axiosMiddleware(client))),
);
export const persistor = persistStore(store);
