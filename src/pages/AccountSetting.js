import React, {useState, useCallback} from "react";
import {View, StyleSheet, Image, ScrollView, ActivityIndicator} from "react-native";
import {Text, Toolbar, FloatingTextinput, Button, CustomTextInput} from "components";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import Toast from "react-native-simple-toast";
import {WooCommerce} from "service";
import {updateUser} from "../store/actions";

function AccountSetting() {
  const {t} = useTranslation();

  const appSettings = useSelector(state => state.appSettings);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const [firstname, setFirstname] = useState(user.first_name);
  const [lastname, setLastname] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [old, setOld] = useState("");
  const [newP, setNewp] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const onChangeFirstname = useCallback(text => {
    setFirstname(text);
  });

  const onChangeLastname = useCallback(text => {
    setLastname(text);
  });

  const onChangeEmail = useCallback(text => {
    setEmail(text);
  });

  const onChangeOld = useCallback(text => {
    setOld(text);
  });

  const onChangeNewp = useCallback(text => {
    setNewp(text);
  });

  const onChangeConfirm = useCallback(text => {
    setConfirm(text);
  });

  const _UpdateProfile = () => {
    let param = {
      first_name: firstname,
      last_name: lastname,
      email: email,
    };
    let redux = {
      first_name: firstname,
      last_name: lastname,
      email: email,
      username: user.username ? user.username : "",
    };
    if (old != "" && newP != "" && confirm != "") {
      param.current_pass = old;
      param.new_pass = newP;
      param.confirm_pass = confirm;
    }

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!reg.test(email)) {
      Toast.show("Your email address is not correct", Toast.LONG);
    } else if (
      !(newP === "" && confirm === "" && old === "") &&
      (newP === "" || confirm === "" || old === "")
    ) {
      Toast.show("Enter Passwords", Toast.LONG);
    } else if (confirm !== newP) {
      Toast.show("New password and confirm password can't different.", Toast.LONG);
    } else {
      setLoading(true);
      WooCommerce.post("customers/" + user.id, param)
        .then(res => {
          console.log(res);
          setLoading(false);
          if (res.status == 200) {
            Toast.show("Your account has been updated.", Toast.LONG);
            dispatch(updateUser(redux));
          } else {
            Toast.show("Nothing to update", Toast.LONG);
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    }
  };

  return (
    <>
      <Toolbar menuButton title={t("ACCOUNT") + " " + t("SETTING")} />
      <ScrollView>
        <View style={styles.card}>
          <Text style={{fontWeight: "600"}}>{t("INFORMATION")}</Text>

          <CustomTextInput
            secureTextEntry={false}
            image={require("../assets/imgs/user.png")}
            placeholder={t("FIRST_NAME")}
            value={firstname}
            onChangeText={onChangeFirstname}
          />

          <CustomTextInput
            secureTextEntry={false}
            image={require("../assets/imgs/user.png")}
            placeholder={t("LAST_NAME")}
            value={lastname}
            onChangeText={onChangeLastname}
          />

          <CustomTextInput
            secureTextEntry={false}
            image={require("../assets/imgs/email.png")}
            placeholder={t("Email")}
            value={email}
            onChangeText={onChangeEmail}
          />

          {/* <FloatingTextinput
            label={t("FIRST_NAME")}
            labelColor="#000000"
            style={{color: "#000000"}}
            value={firstname}
            onChangeText={onChangeFirstname}
          />
          <FloatingTextinput
            label={t("LAST_NAME")}
            labelColor="#000000"
            style={{color: "#000000"}}
            value={lastname}
            onChangeText={onChangeLastname}
          />
          <FloatingTextinput
            editable={false}
            label={t("EMAIL")}
            labelColor="#000000"
            style={{color: "#000000"}}
            value={email}
            onChangeText={onChangeEmail}
          /> */}
        </View>
        <View style={styles.card}>
          <Text style={{fontWeight: "600"}}>Leave Blank To Leave Unchanged</Text>
          <CustomTextInput
            secureTextEntry={true}
            image={require("../assets/imgs/key.png")}
            placeholder={t("OLD") + " " + t("PASSWORD")}
            value={old}
            onChangeText={onChangeOld}
          />
          <CustomTextInput
            secureTextEntry={true}
            image={require("../assets/imgs/key.png")}
            placeholder={t("NEW") + " " + t("PASSWORD")}
            value={newP}
            onChangeText={onChangeNewp}
          />
          <CustomTextInput
            secureTextEntry={true}
            image={require("../assets/imgs/key.png")}
            placeholder={t("CONFIRM_PASSWORD")}
            value={confirm}
            onChangeText={onChangeConfirm}
          />
          {/* <FloatingTextinput
            secureTextEntry={true}
            label={t("OLD") + " " + t("PASSWORD")}
            labelColor="#000000"
            style={{color: "#000000"}}
            value={old}
            onChangeText={onChangeOld}
          /> */}
          {/* <FloatingTextinput
            secureTextEntry={true}
            label={t("NEW") + " " + t("PASSWORD")}
            labelColor="#000000"
            style={{color: "#000000"}}
            value={newP}
            onChangeText={onChangeNewp}
          />
          <FloatingTextinput
            secureTextEntry={true}
            label={t("CONFIRM_PASSWORD")}
            labelColor="#000000"
            style={{color: "#000000"}}
            value={confirm}
            onChangeText={onChangeConfirm}
          /> */}
        </View>
        {loading && <ActivityIndicator />}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          style={[styles.footerButton, {backgroundColor: appSettings.accent_color}]}
          onPress={_UpdateProfile}>
          <Text style={{color: "white", marginEnd: 5, fontWeight: "600"}}>{t("SAVE")}</Text>
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    //elevation: 2,
    // shadowRadius: 2,
    padding: 10,
    marginTop: 16,
    marginHorizontal: 16,
    //shadowOpacity: 0.5,
    //shadowOffset: {width: 0, height: 2},
    //backgroundColor: "#fff",
  },
  footer: {
    width: "100%",
    flexDirection: "row",
  },
  footerButton: {
    flex: 1,
    height: 40,
    //margin: 5,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AccountSetting;
