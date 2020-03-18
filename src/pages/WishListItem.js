import React, {useState} from "react";
import {View, StyleSheet, TouchableWithoutFeedback, Alert, Dimensions} from "react-native";
import {useSelector, useDispatch} from "react-redux";
import {HTMLRender, Text, Icon, Button} from "components";
import StarRating from "react-native-star-rating";
import FitImage from "react-native-fit-image";
import {deleteWishlist} from "../store/actions";

function WishListItem({item, index}) {
  const {accent_color} = useSelector(state => state.appSettings);
  const dispatch = useDispatch();
  const {width} = Dimensions.get("window");

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

  return (
    <TouchableWithoutFeedback>
      <View
        style={[
          index % 2 == 0 ? {marginStart: 12, marginEnd: 10} : {marginEnd: 10},
          styles.container,
          {width: width / 2 - 18},
          {marginTop: index == 0 ? 12 : 6, marginBottom: 6},
        ]}>
        {item.images.length > 0 && <FitImage source={{uri: item.images[0].src}} />}
        <View>
          <View style={{flexDirection: "row", justifyContent: "space-between", flex: 1}}>
            <Text style={[styles.itemMargin, {fontWeight: "600", flex: 1}]} numberOfLines={1}>
              {item.name}
            </Text>
            <Button onPress={removeItem(item)}>
              <Icon name="delete" type="MaterialCommunityIcons" size={28} color={accent_color} />
            </Button>
          </View>
          {item.price_html != "" && (
            <HTMLRender
              html={item.price_html}
              containerStyle={styles.itemMargin}
              baseFontStyle={{fontSize: 13}}
            />
          )}
          <StarRating
            disabled
            maxStars={5}
            rating={parseInt(item.average_rating)}
            containerStyle={[styles.itemMargin, styles.star]}
            starStyle={{marginEnd: 5}}
            starSize={14}
            halfStarEnabled
            emptyStarColor={accent_color}
            fullStarColor={accent_color}
            halfStarColor={accent_color}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
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
