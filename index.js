/**
 * @format
 */

import "react-native-gesture-handler";
//React Native screens
import {useScreens} from "react-native-screens";
useScreens();
//bugsnag
import {Client} from "bugsnag-react-native";
const bugsnag = new Client("b08eb5a51c4c091fbb23888466fb6a24");
//bugsnag.notify(new Error("Test error"));
import {AppRegistry} from "react-native";
import App from "./App";
import {name as appName} from "./app.json";

AppRegistry.registerComponent(appName, () => App);
