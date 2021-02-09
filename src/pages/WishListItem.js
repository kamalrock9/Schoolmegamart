import React, {useState} from "react";
import {View, StyleSheet, TouchableOpacity, Alert, Dimensions, Image} from "react-native";
import {useSelector, useDispatch} from "react-redux";
import {HTMLRender, Text, Icon, Button, WishlistIcon} from "components";
import StarRating from "react-native-star-rating";
import FitImage from "react-native-fit-image";
import {deleteWishlist} from "../store/actions";
import {useNavigation} from "react-navigation-hooks";
import {isFinite} from "lodash";

function WishListItem({item, index}) {
  const {accent_color} = useSelector(state => state.appSettings);
  const dispatch = useDispatch();
  const {width} = Dimensions.get("window");
  const navigation = useNavigation();
  console.log(item);

  const removeItem = item => () => {
    console.log(item);
    Alert.alert(
      "Remove From Wishlist",
      "Are you sure to remove this?",
      [
        {text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel"},
        {text: "OK", onPress: () => dispatch(deleteWishlist(item.id))},
      ],
      {cancelable: false},
    );
  };

  const gotoPage = item => () => {
    navigation.navigate("ProductDetailScreen", item);
  };

  const discount = ((item.regular_price - item.sale_price) / item.regular_price) * 100;

  return (
    <TouchableOpacity onPress={gotoPage(item)}>
      <View
        style={[
          index % 2 == 0 ? {marginStart: 12} : {marginStart: 8},
          {
            width: width / 2 - 16,
            backgroundColor: "#EAEAF1",
            paddingVertical: 20,
            borderRadius: 8,
            marginTop: 8,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}>
        {item.images.length > 0 && (
          <Image
            resizeMode="contain"
            style={{width: 150, height: 150}}
            source={{uri: item.images[0].src}}
            indicatorColor={accent_color}
          />
        )}

        {item.on_sale && (
          <View
            style={{
              marginStart: 5,
              marginTop: 5,
              position: "absolute",
              top: 0,
              start: 0,
              backgroundColor: accent_color,
              width: 42,
              height: 42,
              borderRadius: 21,
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
            }}>
            <Text style={{fontSize: 10, color: "#fff", fontWeight: "600"}}>
              {isFinite(discount)
                ? Math.round((discount + Number.EPSILON) * 10) / 10 + "%" + "\n" + "OFF"
                : "SALE"}
            </Text>
          </View>
        )}
        {/* <WishlistIcon style={styles.right} item={item} /> */}
      </View>
      <View
        style={[{width: width / 2 - 16}, index % 2 == 0 ? {marginStart: 12} : {marginStart: 8}]}>
        <Text style={[styles.itemMargin, {fontWeight: "600", fontSize: 12}]} numberOfLines={1}>
          {item.name}
        </Text>
        <StarRating
          disabled
          maxStars={5}
          rating={parseInt(item.average_rating)}
          containerStyle={[styles.itemMargin, styles.star]}
          starStyle={{marginEnd: 5}}
          starSize={10}
          halfStarEnabled
          emptyStarColor={accent_color}
          fullStarColor={accent_color}
          halfStarColor={accent_color}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingEnd: 16,
            marginBottom: 8,
          }}>
          {item.price_html != "" && (
            <HTMLRender
              html={item.price_html}
              containerStyle={styles.itemMargin}
              baseFontStyle={{fontSize: 12, fontWeight: "600"}}
            />
          )}
          <Button onPress={removeItem(item)}>
            <Image
              resizeMode="contain"
              source={require("../assets/imgs/delete.png")}
              style={{width: 25, height: 25}}
            />
          </Button>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "#bdbdbd",
    paddingBottom: 8,
    justifyContent: "flex-end",
  },
  star: {
    justifyContent: "flex-start",
  },
  itemMargin: {
    marginStart: 8,
    marginTop: 4,
  },
  right: {
    position: "absolute",
    end: 0,
    top: 0,
  },
});

export default WishListItem;
