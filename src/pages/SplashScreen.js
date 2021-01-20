import React, {useEffect, useState} from "react";
import {Image, StyleSheet, View, Dimensions, Alert, BackHandler, Linking} from "react-native";
import {saveAppSettings, getCartCount, filterCategory} from "store/actions";
import {useSelector, useDispatch} from "react-redux";
import {isEmpty} from "lodash";
import Toast from "react-native-simple-toast";
import i18n from "i18next";
import {useTranslation, initReactI18next} from "react-i18next";
import en from "../assets/i18n/en.json";
import hi from "../assets/i18n/hi.json";
import ar from "../assets/i18n/ar.json";
import {ApiClient} from "service";
import Modal from "react-native-modal";
import {Text} from "components";
import VersionCheck from "react-native-version-check";
import analytics from "@react-native-firebase/analytics";

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
  const [maintenance, setMaintenance] = useState(false);
  const appSettings = useSelector(state => state.appSettings);
  const filterCat = useSelector(state => state.filterCategory);
  const dispatch = useDispatch();

  useEffect(() => {
    trackScreenView("Splash Screen");
    if (isEmpty(filterCat)) {
      ApiClient.get("/products/all-categories")
        .then(({data}) => {
          let filterCat = data.filter(item => item.hide_on_app === "no" && item.parent === 0);
          dispatch(filterCategory(filterCat));
        })
        .catch(error => {
          Toast.show("Something went wrong! Try again");
        });
    }
    if (isEmpty(appSettings)) {
      console.log("wait");

      ApiClient.get("/app-settings")
        .then(({data}) => {
          dispatch(saveAppSettings(data));
          if (data.app_status == "under-maintenance") {
            setMaintenance(true);
            return;
          } else {
            checkUpdateNeeded(data);
          }
        })
        .catch(() => {
          Toast.show("Something went wrong! Try again");
        });
    } else {
      // if (appSettings.app_status == "under-maintenance") {
      //   setMaintenance(true);
      //   return;
      // } else {
      ApiClient.get("/app-settings").then(({data}) => {
        dispatch(saveAppSettings(data));
        if (data.app_status == "under-maintenance") {
          setMaintenance(true);
          return;
        } else {
          checkUpdateNeeded(data);
        }
      });
      //}
    }
    dispatch(getCartCount());
  }, []);

  const checkUpdateNeeded = data => {
    console.log(data);
    VersionCheck.needUpdate()
      .then(res => {
        console.log(res);
        if (res.currentVersion != data.current_app_version) {
          Alert.alert(
            "Please Update",
            "You will have to update your app to the latest version to continue using.",
            [
              {
                text: "Update",
                onPress: () => {
                  BackHandler.exitApp();
                  Linking.openURL(res.storeUrl);
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          navigation.navigate("Drawer");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

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
      <Modal
        isVisible={maintenance}
        style={{margin: 0}}
        //  onBackButtonPress={closeModal}
        //  onBackdropPress={closeModal}
        useNativeDriver
        hideModalContentWhileAnimating>
        <View
          style={{
            backgroundColor: "#fff",
            marginHorizontal: 64,
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}>
          <Image
            source={require("../assets/imgs/maintenance.png")}
            style={{width: width / 3, height: width / 3}}
          />
          <Text style={{fontWeight: "500", fontSize: 20, marginVertical: 20}}>
            Under Maintenance
          </Text>
          <Text style={{textAlign: "center"}}>
            The App You Are Looking For Is Currently Under Maintenance And Will Back Soon
          </Text>
        </View>
      </Modal>
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
