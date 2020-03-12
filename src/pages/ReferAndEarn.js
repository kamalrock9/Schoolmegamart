import {
  View,
  ImageBackground,
  Dimensions,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {Text, Button, Icon, HTMLRender} from "components";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {ApiClient} from "service";
import Share from "react-native-share";

const {height, width} = Dimensions.get("window");

function ReferAndEarn({navigation}) {
  const user = useSelector(state => state.user);
  const appSettings = useSelector(state => state.appSettings);

  const [code, setCode] = useState("");
  const [loading, setloading] = useState(false);

  useEffect(() => {
    let param = {
      user_id: user.id,
    };
    setloading(true);
    ApiClient.get("/refer", param)
      .then(res => {
        setloading(false);
        if (res.status == 200) {
          console.log(res);
          res.data.htmlMsg =
            "Invite your friends on WooApp and get " +
            res.data.amount_referrer +
            " as wllet credit.Your friend will also get " +
            res.data.amount_earner +
            " as wallet credit.";
          setCode(res.data);
        } else {
          setCode("");
        }
      })
      .catch(error => {
        setloading(false);
      });
  }, []);

  const share = () => {
    let options = {
      url:
        Platform.OS == "ios"
          ? "https://apps.apple.com/app/id1491593829"
          : "https://play.google.com/store/apps/details?id=com.phoeniixx.wooapp",
      message: code.message,
    };
    setloading(true);
    Share.open(options)
      .then(res => {
        setloading(false);
        console.log(res);
      })
      .catch(err => {
        setloading(false);
        err && console.log(err);
      });
  };

  const _goBack = () => {
    navigation.goBack(null);
  };

  return (
    <View>
      {code != "" ? (
        <>
          <ImageBackground
            resizeMode="cover"
            style={{height: height / 3, width}}
            source={require("../assets/imgs/referandearn.jpg")}>
            <Button
              style={[
                styles.fabBtn,
                {
                  backgroundColor: appSettings.accent_color,
                },
              ]}
              onPress={_goBack}>
              <Icon
                name="cross"
                type="Entypo"
                color="#fff"
                size={28}
                style={{alignSelf: "center"}}
              />
            </Button>
          </ImageBackground>
          <Text style={{alignSelf: "center", marginTop: 20, fontWeight: "300"}}>
            YOUR REFERRAL CODE
          </Text>
          <View style={styles.codeView}>
            <Text style={{fontWeight: "600", fontSize: 16}}>{code.refer_earn_code}</Text>
          </View>
          <View style={{marginHorizontal: 16}}>
            <HTMLRender html={code.htmlMsg || "<b></b>"} baseFontStyle={{fontWeight: "300"}} />
            <Text style={{marginTop: 30, fontWeight: "300"}}>
              Referral Valid upto {code.refer_earn_uses} friends.
            </Text>
          </View>
          <Button
            style={[
              styles.shareButton,
              {
                backgroundColor: appSettings.accent_color,
              },
            ]}
            onPress={share}>
            <Text style={{color: "#fff"}}>INVITE FRIENDS</Text>
          </Button>
        </>
      ) : (
        <View></View>
      )}
      {loading && <ActivityIndicator style={{flex: 1}} />}
    </View>
  );
}

const styles = StyleSheet.create({
  fabBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    marginStart: 10,
    marginTop: 10,
    justifyContent: "center",
  },
  codeView: {
    borderWidth: 2,
    borderColor: "#d2d2d2",
    margin: 16,
    borderStyle: "dashed",
    alignItems: "center",
    paddingVertical: 20,
    justifyContent: "center",
  },
  shareButton: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    borderRadius: 2,
    paddingVertical: 10,
    elevation: 2,
    marginTop: 150,
  },
});

export default ReferAndEarn;
