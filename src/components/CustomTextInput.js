import React from "react";
import {View, Image, TextInput} from "react-native";

function CustomTextInput({image, value, onChangeText, placeholder, secureTextEntry}) {
  return (
    <View style={{flexDirection: "row", alignItems: "center"}}>
      <Image source={image} style={{width: 15, height: 15, resizeMode: "contain"}} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomColor: "#d2d2d2",
          borderBottomWidth: 1,
          marginHorizontal: 16,
        }}>
        <TextInput
          secureTextEntry={secureTextEntry}
          style={{flex: 1, alignSelf: "center"}}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
        <Image
          source={require("../assets/imgs/edit.png")}
          style={{width: 15, height: 15, resizeMode: "contain"}}
        />
      </View>
    </View>
  );
}

export default CustomTextInput;
