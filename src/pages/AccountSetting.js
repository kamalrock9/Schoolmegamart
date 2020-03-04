import React, {useState, useCallback} from "react";
import {View, StyleSheet} from "react-native";
import {Text, Toolbar, FloatingTextinput} from "components";
import {useTranslation} from "react-i18next";

function AccountSetting() {
  const {t} = useTranslation();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [old, setOld] = useState("");
  const [newP, setNewp] = useState("");
  const [confirm, setConfirm] = useState("");

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

  return (
    <View>
      <Toolbar backButton title="Account Setting" />
      <View style={styles.card}>
        <Text style={{fontWeight: "600"}}>Information</Text>
        <FloatingTextinput
          label={t("FIRST_NAME")}
          labelColor="#000000"
          style={{color: "#FFFFFF"}}
          value={firstname}
          onChangeText={onChangeFirstname}
        />
        <FloatingTextinput
          label={t("LAST_NAME")}
          labelColor="#000000"
          style={{color: "#FFFFFF"}}
          value={lastname}
          onChangeText={onChangeLastname}
        />
        <FloatingTextinput
          label={t("EMAIL")}
          labelColor="#000000"
          style={{color: "#FFFFFF"}}
          value={email}
          onChangeText={onChangeEmail}
        />
      </View>
      <View style={styles.card}>
        <Text style={{fontWeight: "600"}}>Leave Blank To Leave Unchanged</Text>
        <FloatingTextinput
          label={t("OLD") + " " + t("PASSWORD")}
          labelColor="#000000"
          style={{color: "#FFFFFF"}}
          value={old}
          onChangeText={onChangeOld}
        />
        <FloatingTextinput
          label={t("NEW") + " " + t("PASSWORD")}
          labelColor="#000000"
          style={{color: "#FFFFFF"}}
          value={newP}
          onChangeText={onChangeNewp}
        />
        <FloatingTextinput
          label={t("CONFIRM_PASSWORD")}
          labelColor="#000000"
          style={{color: "#FFFFFF"}}
          value={confirm}
          onChangeText={onChangeConfirm}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    shadowRadius: 2,
    padding: 10,
    marginTop: 16,
    marginHorizontal: 16,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    backgroundColor: "#fff",
  },
});

export default AccountSetting;
