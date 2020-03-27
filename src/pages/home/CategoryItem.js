import React from "react";
import { View, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "components";

function CategoryItem({ item, index }) {
  return (
    <View
      style={[
        { width: 80, height: 60, borderRadius: 3 },
        index == 0 ? { marginStart: 12, marginEnd: 10 } : { marginEnd: 10 },
      ]}>
      <ImageBackground
        source={{
          uri: item.image ? item.image : "https://source.unsplash.com/1600x900/?" + item.name,
        }}
        style={{ width: null, height: null, flex: 1 }}>
        <LinearGradient
          colors={["#afafaf5e", "#000000ff"]}
          style={{ position: "absolute", width: "100%", bottom: 0 }}>
          <Text style={{ color: "white", textAlign: "center", fontSize: 10, paddingVertical: 2, fontWeight: "700" }}>{item.name.toUpperCase()}</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
export default CategoryItem;
