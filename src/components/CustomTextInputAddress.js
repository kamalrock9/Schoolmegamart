import {View, TextInput} from "react-native";
import Text from "./Text";
import React from "react";

function CustomTextInputAddress({viewstyle, value, onChangeText, label, textColor, keyboardType}) {
  return (
    <View style={{...viewstyle}}>
      <Text style={{fontSize: 12, color: "grey", ...textColor}}>{label}</Text>
      <TextInput
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "grey",
          height: 26,
          paddingVertical: 2,
        }}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ? "numeric" : "default"}
      />
    </View>
  );
}

export default CustomTextInputAddress;
