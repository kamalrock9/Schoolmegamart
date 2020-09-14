import React, {useEffect} from "react";
import {Image, StyleSheet, View, Dimensions} from "react-native";
import {saveAppSettings, getCartCount} from "store/actions";
import {useSelector, useDispatch} from "react-redux";
import {isEmpty} from "lodash";
import Toast from "react-native-simple-toast";
import i18n from "i18next";
import {useTranslation, initReactI18next} from "react-i18next";
import en from "../assets/i18n/en.json";
import hi from "../assets/i18n/hi.json";
import ar from "../assets/i18n/ar.json";

import {ApiClient} from "service";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {translation: en},
      hi: {translation: hi},
      ar: {translation: ar},
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

const {width, height} = Dimensions.get("window");
function SplashScreen({navigation}) {
  const appSettings = useSelector(state => state.appSettings);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(appSettings)) {
      console.log("wait");

      ApiClient.get("/app-settings")
        .then(({data}) => {
          dispatch(saveAppSettings(data));
          navigation.navigate("Drawer");
        })
        .catch(() => {
          Toast.show("Something went wrong! Try again");
        });
    } else {
      navigation.navigate("Drawer");
      ApiClient.get("/app-settings").then(({data}) => {
        dispatch(saveAppSettings(data));
      });
    }
    dispatch(getCartCount());
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/imgs/SplashBG.png")}
        style={{width, height: 200, position: "absolute", top: 0}}
      />
      <Image
        source={require("../assets/imgs/splashLogo.png")}
        style={{width: 250, height: 250, resizeMode: "contain"}}
      />
      <Image
        source={require("../assets/imgs/SplashBG1.png")}
        style={{width, height: 200, position: "absolute", bottom: 0}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(SplashScreen);
