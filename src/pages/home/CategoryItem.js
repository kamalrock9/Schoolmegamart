import React from "react";
import {TouchableOpacity, Image} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {useNavigation} from "react-navigation-hooks";
import {Text} from "components";

function CategoryItem({item, index}) {
  const navigation = useNavigation();

  const goToProductScreen = () => {
    navigation.navigate("ProductScreen", {category_id: item.id});
  };

  return (
    <TouchableOpacity
      style={[
        {
          marginTop: 10,
          marginBottom: 15,
        },
        index == 0 ? {marginStart: 18, marginEnd: 16} : {marginEnd: 16},
      ]}
      onPress={goToProductScreen}>
      <Image
        source={{
          uri: item.image
            ? typeof item.image == "string"
              ? item.image
              : item.image.src
            : "https://source.unsplash.com/1600x900/?" + item.name,
        }}
        style={{width: 60, height: 60, borderRadius: 30}}
        resizeMode="cover"
      />
      <Text
        style={{
          color: "black",
          textAlign: "center",
          fontSize: 10,
          width: 60,
          paddingVertical: 2,
          fontWeight: "700",
        }}>
        {item.name.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

export default CategoryItem;
