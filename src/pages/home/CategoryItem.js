import React from "react";
import {TouchableOpacity, Image, View, Dimensions} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {useNavigation} from "react-navigation-hooks";
import {Text} from "components";

const {width, height} = Dimensions.get("screen");
function CategoryItem({item, index}) {
  const navigation = useNavigation();

  const goToProductScreen = () => {
    navigation.navigate("ProductScreen", {category_id: item});
  };

  return (
    <TouchableOpacity
      style={[
        {
          alignItems: "center",
          marginEnd: 8,
        },
      ]}
      onPress={goToProductScreen}>
      <View
        style={{
          backgroundColor: "#ED7833",
          paddingVertical: 12,
          paddingHorizontal: 4,
          borderRadius: 8,
          height: 110,
          alignItems: "center",
        }}>
        <Image
          source={{
            uri: item.image
              ? typeof item.image == "string"
                ? item.image
                : item.image.src
              : "https://source.unsplash.com/1600x900/?" + item.name,
          }}
          style={{width: 40, height: 40}}
          resizeMode="contain"
        />
        <Text
          style={{
            width: width / 5,
            color: "white",
            textAlign: "center",
            fontSize: 10,
            fontWeight: "500",
            paddingVertical: 2,
          }}>
          {item.name.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default CategoryItem;
