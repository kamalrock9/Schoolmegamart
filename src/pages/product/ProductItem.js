import React, {useState} from "react";
import {View, StyleSheet, TouchableWithoutFeedback} from "react-native";
import {useSelector} from "react-redux";
import {useNavigation} from "react-navigation-hooks";
import {HTMLRender, Text, WishlistIcon, ScaledImage} from "components";
import StarRating from "react-native-star-rating";

function ProductItem({containerStyle, width: propWidth, item}) {
  const navigation = useNavigation();
  const {accent_color} = useSelector(state => state.appSettings);

  const [width, setWidth] = useState(propWidth);

  const goToProductDetails = () => {
    navigation.push("ProductDetailScreen", item);
  };

  const onLayout = e => {
    if (!(width || width == e.nativeEvent.layout.width)) {
      setWidth(Math.floor(e.nativeEvent.layout.width));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={goToProductDetails}>
      <View style={[containerStyle, styles.container, {width}]} onLayout={onLayout}>
        {item.images.length > 0 && (
          <ScaledImage
            source={{uri: item.images[0].src}}
            width={width - 1}
            approxHeight={width ? width : 180}
          />
        )}
        <View>
          <Text style={[styles.itemMargin, {fontWeight: "600"}]} numberOfLines={1}>
            {item.name}
          </Text>
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
        <WishlistIcon style={styles.right} item={item} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "#bdbdbd",
    paddingBottom: 8,
    justifyContent: "flex-end",
  },
  thumb: {
    resizeMode: "contain",
    height: 180,
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

export default React.memo(ProductItem);
