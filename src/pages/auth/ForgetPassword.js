import React, {useState, useCallback} from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {Text, Icon, Button} from "components";
import Toast from "react-native-simple-toast";
import {ApiClient} from "service";
import axios from "axios";

function ForgetPassword({navigation}) {
  const [email, changeEmail] = useState("");
  const [loading, setloading] = useState(false);

  const onChangeEmail = useCallback(text => {
    changeEmail(text);
  });

  const goback = () => {
    navigation.goBack();
  };

  const Forgot = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === true) {
      var bodyFormData = new FormData();
      bodyFormData.append("user_mail", email);
      setloading(true);
      console.log(bodyFormData);
      axios
        .post("https://school.themiixx.com/wp-json/wc/v2/forget-password/app/send", bodyFormData)
        .then(({data}) => {
          console.log(data);
          setloading(false);
          if (data.status == 1) {
            //navigation.goBack();
            Toast.show(data.message, Toast.LONG);
            navigation.navigate("ForgetPasswordOTPVerify", {
              Token: data.token,
              email: email,
            });
          } else {
            Toast.show(data.message, Toast.LONG);
          }
        })
        .catch(error => {
          setloading(false);
          console.log(error);
        });
    } else {
      Toast.show("Please enter the correct email address", Toast.LONG);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: "#F9FAFC"}}>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <Button style={{padding: 8, alignSelf: "flex-start"}} onPress={goback}>
          <Icon name="close" size={24} color="#000" type="MaterialCommunityIcons" />
        </Button>
        <Image
          source={require("../../assets/imgs/containerLogo.png")}
          style={{
            width: 220,
            height: 220,
            resizeMode: "contain",
            position: "absolute",
            right: 0,
            marginRight: -50,
            marginTop: -50,
          }}
        />
      </View>
      <View style={styles.container}>
        <Image
          style={{width: 80, height: 85, resizeMode: "contain"}}
          source={require("../../assets/imgs/BigKey.png")}
        />
        <Text style={{fontWeight: "500", fontSize: 16, marginTop: 15}}>Forgot Password</Text>
        <Text
          style={{
            paddingHorizontal: 32,
            fontWeight: "500",
            color: "grey",
            marginTop: 15,
          }}>
          Select contact details should we use to reset password
        </Text>
        <View style={styles.textinputview}>
          <Image
            style={{width: 16, height: 16, marginHorizontal: 12}}
            source={require("../../assets/imgs/user.png")}
          />

          <TextInput
            //caretHidden
            placeholder="Email"
            style={[styles.textinput, {marginTop: 3}]}
            value={email}
            onChangeText={onChangeEmail}
          />
        </View>
        <View
          style={{
            marginTop: 25,
            alignSelf: "flex-end",
            marginEnd: 16,
            flexDirection: "row",
            alignItems: "center",
          }}>
          <Text style={[styles.btnText, {color: "#000", marginRight: 8}]}>Forgot</Text>
          <TouchableOpacity onPress={Forgot}>
            <Image
              source={require("../../assets/imgs/signIn.png")}
              style={{width: 60, resizeMode: "contain"}}
            />
          </TouchableOpacity>
        </View>
      </View>
      {loading && (
        <ActivityIndicator style={{alignItems: "center", justifyContent: "center", flex: 1}} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: "20%",
  },
  textinput: {
    paddingVertical: 6,
    flex: 1,
    borderRadius: 2,
    paddingStart: 8,
  },
  textinputview: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    backgroundColor: "#fff",
    elevation: 2,
    borderRadius: 4,
    marginHorizontal: 16,
    marginTop: 40,
  },
  btnText: {
    fontWeight: "600",
    color: "#fff",
  },
});

export default ForgetPassword;
