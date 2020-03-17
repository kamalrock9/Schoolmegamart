import {View} from "react-native";
import {Text, Toolbar} from "components";
import React from "react";
import {useTranslation} from "react-i18next";

function Notification() {
  const {t} = useTranslation();
  return (
    <View>
      <Toolbar backButton title={t("NOTIFICATIONS")} />
      <Text>Notification</Text>
    </View>
  );
}

export default Notification;
