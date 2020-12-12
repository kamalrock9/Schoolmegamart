import React, {useState} from "react";
import {View, TextInput, StyleSheet, Dimensions} from "react-native";
import {Text, Toolbar, Button, ProgressDialog} from "components";
import {useSelector} from "react-redux";
import axios from "axios";
import Toast from "react-native-simple-toast";

const {width} = Dimensions.get("screen");
function NewPassword({navigation}) {
  console.log(navigation.state.params);
  const [newPassword, setNewPassword] = useState("");
  const [newConfirm, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {accent_color} = useSelector(state => state.appSettings);

  const onChangeNew = text => {
    setNewPassword(text);
  };

  const onChangeConfirm = text => {
    setConfirmPassword(text);
  };

  const _ChangePassword = () => {
    const {Token} = navigation.state.params;
    var bodyFormData = new FormData();
    bodyFormData.append("password", newPassword);
    bodyFormData.append("confirm_password", newConfirm);
    bodyFormData.append("token", Token);
    console.log(bodyFormData);
    if (newPassword == newConfirm) {
      setLoading(true);
      axios
        .post(
          "https://school.themiixx.com/wp-json/wc/v2/forget-passowrd/app/new-password",
          bodyFormData,
        )
        .then(({data}) => {
          setLoading(false);
          console.log(data);
          if (data.status) {
            Toast.show(data.message, Toast.LONG);
            navigation.navigate("Auth");
          } else {
            Toast.show(data.message, Toast.LONG);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      Toast.show("New Password and Confirm password can't different.");
    }
  };

  return (
    <>
      <Toolbar title="New Password" backButton />
      <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
        <TextInput
          //caretHidden
          secureTextEntry={true}
          placeholder="New password"
          style={[styles.textinput]}
          value={newPassword}
          onChangeText={onChangeNew}
        />
        <TextInput
          //caretHidden
          secureTextEntry={true}
          placeholder="Confirm password"
          style={[styles.textinput, {marginTop: 16}]}
          value={newConfirm}
          onChangeText={onChangeConfirm}
        />
        <Button
          style={{
            backgroundColor: accent_color,
            width: width - 24,
            marginTop: 24,
            alignItems: "center",
            borderRadius: 4,
            paddingVertical: 8,
          }}
          onPress={_ChangePassword}>
          <Text style={{color: "#fff", fontWeight: "600"}}>Submit</Text>
        </Button>
        <ProgressDialog loading={loading} />
      </View>
    </>
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
    borderRadius: 4,
    paddingStart: 8,
    borderColor: "grey",
    borderWidth: 1,
    width: width - 24,
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

export default NewPassword;
