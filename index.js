/**
 * @format
 */

import "react-native-gesture-handler";
//React Native screens
import {useScreens} from "react-native-screens";
useScreens();

import {AppRegistry} from "react-native";
import Bugsnag from "@bugsnag/react-native";
import App from "./App";
import {name as appName} from "./app.json";

Bugsnag.start();

AppRegistry.registerComponent(appName, () => App);
