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
              ? "#FEDCBD"
              : index == 1
              ? "#A6EFC8"
              : index % 2 == 0 && index % 4 != 0
              ? "#FEDCBD"
              : index % 3 == 0 && index % 2 != 0 && index % 4 != 0
              ? "#BDEDFE"
              : index % 4 == 0 && index % 3 != 0 && index % 2 == 0
              ? "#FEDCBD"
              : index % 5 == 0
              ? "#A6EFC8"
              : index % 2 != 0
              ? "#BDEDFE"
              : "#A6EFC8",
          padding: 8,
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
          style={{width: 60, height: 60, borderRadius: 30}}
          resizeMode="cover"
        />
      </View>
      <Text
        style={{
          color: "black",
          textAlign: "center",
          fontSize: 10,
          width: 68,
          paddingVertical: 2,
          fontWeight: "700",
        }}>
        {item.name.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

export default CategoryItem;
