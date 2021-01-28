import React from "react";
import {TouchableOpacity, Image, View} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {useNavigation} from "react-navigation-hooks";
import {Text} from "components";

function CategoryItem({item, index}) {
  const navigation = useNavigation();

  const goToProductScreen = () => {
    navigation.navigate("ProductScreen", {category_id: item});
  };

  return (
    <TouchableOpacity
      style={[
        {
          marginTop: 10,
          marginBottom: 15,
          alignItems: "center",
        },
        index == 0 ? {marginStart: 18, marginEnd: 16} : {marginEnd: 16},
      ]}
      onPress={goToProductScreen}>
      <View
        style={{
          backgroundColor:
            index == 0
              ? "#FEDBBC"
              : index == 1
              ? "#A6EFC7"
              : index % 4 && !index % 2
              ? "#BCECFE"
              : index % 2
              ? "#BCECFE"
              : "#FEDBBC",
          padding: 12,
          borderRadius: 50,
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
          resizeMode="cover"
        />
      </View>
      <View style={{width: 76}}>
        <Text
          style={{
            color: "black",
            textAlign: "center",
            fontSize: 10,
            paddingVertical: 2,
            fontWeight: "700",
          }}>
          {item.name.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default CategoryItem;
