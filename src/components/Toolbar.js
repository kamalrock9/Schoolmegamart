import React from "react";
import {View, StyleSheet, StatusBar, Image} from "react-native";
import Text from "./Text";
import Button from "./Button";
import Icon from "./IconNB";
import HTMLRender from "./HTMLRender";
import {useSelector} from "react-redux";
import {useNavigation, useNavigationState} from "react-navigation-hooks";
import {useTranslation} from "react-i18next";
import {isEmpty, isArray} from "lodash";
import {SvgMenu} from "../assets/svgs";

function Toolbar({
  title,
  menuButton,
  backButton,
  wishListButton,
  cartButton,
  cancelButton,
  onCancel,
  walletBalance,
  searchButton,
  paymentpage,
  image
}) {
  const navigation = useNavigation();
  const {routeName} = useNavigationState();
  const {t} = useTranslation();
  const {
    primary_color_dark,
    primary_color,
    primary_color_text,
    toolbarbadgecolor,
    accent_color,
  } = useSelector(state => state.appSettings);
  const count = useSelector(state => state.cartCount);
  const wishlist = useSelector(state => state.wishlist);

  const goTo = route => () => {
    navigation.navigate(route);
  };

  const goBack = () => {
    navigation.goBack(null);
  };

  const submitt = () => {
    submit && submit();
  };

  return (
    <>
      <StatusBar backgroundColor={primary_color_dark} barStyle="light-content" />
      <View style={[styles.container, {backgroundColor:primary_color}]}>
        {menuButton && (
          <Button onPress={navigation.openDrawer} style={styles.menuButton}>
            <SvgMenu style={styles.drawerItemIcon} width={18} height={18} />
            {/* <Icon color={"#000"} name="md-menu" size={24} /> */}
          </Button>
        )}
        {backButton && (
          <Button onPress={goBack} style={styles.menuButton}>
            <Icon color={"#000"} name="keyboard-backspace" type="MaterialIcons" size={24} />
          </Button>
        )}
        {paymentpage && (
          <Button onPress={goTo("HomeScreen")} style={styles.menuButton}>
            <Icon color={"#000"} name="md-arrow-back" size={24} />
          </Button>
        )}
        {cancelButton && (
          <Button onPress={onCancel} style={styles.menuButton}>
            <Icon color={"#000"} name="cross" type="Entypo" size={24} />
          </Button>
        )}

        <Text style={[styles.title, {color: "#000", width: "100%"}]} ellipsizeMode="tail">
          {title != "" ?  t(title) || t(routeName) : ""}
        </Text>

        {/* {image && <Image source={require("../assets/imgs/HomeIcon.png")} resizeMode="contain" style={{width:80,height:40}} />} */}


        <View style={styles.right}>
          {searchButton && (
            <Button
              style={[styles.right, {paddingVertical: 16, paddingHorizontal: 6}]}
              onPress={goTo("Search")}>
              <Icon name="search" type="EvilIcons" size={30} />
              {/* <Image
                resizeMode="contain"
                source={{width: "100%", height: 15}}
                source={require("../assets/imgs/search.png")}
              /> */}
            </Button>
          )}
          {wishListButton && (
            <Button
              onPress={goTo("WishlistScreen")}
              style={[styles.menuButton, {paddingVertical: 16, paddingHorizontal: 6}]}>
              <Icon name="heart" type="EvilIcons" size={30} />
              {/* <Image
                resizeMode="contain"
                source={{width: "100%", height: 20}}
                source={require("../assets/imgs/wishlist.png")}
              /> */}
              {isArray(wishlist) && !isEmpty(wishlist) && (
                <View style={[styles.badge, {backgroundColor: toolbarbadgecolor || accent_color}]}>
                  <Text style={styles.badgeText}>{wishlist.length}</Text>
                </View>
              )}
            </Button>
          )}
          {cartButton && (
            <Button
              onPress={goTo("Cart")}
              style={[styles.menuButton, {paddingVertical: 16, paddingHorizontal: 6}]}>
              <Icon name="cart" type="EvilIcons" size={30} />
              {/* <Image
                resizeMode="contain"
                source={{width: "100%", height: 15}}
                source={require("../assets/imgs/addToCart.png")}
              /> */}
              {count > 0 && (
                <View style={[styles.badge, {backgroundColor: toolbarbadgecolor || accent_color}]}>
                  <Text style={styles.badgeText}>{count}</Text>
                </View>
              )}
            </Button>
          )}
          {!isEmpty(walletBalance) && (
            <HTMLRender
              html={walletBalance}
              baseFontStyle={{color: "#000"}}
              containerStyle={{paddingEnd: 10}}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal:2
    // height: 56,
  },
  badge: {
    position: "absolute",
    end: 6,
    top: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "600",
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    flex: 1,
  },
  right: {
    flexDirection: "row",
    marginStart: 0,
  },
  menuButton: {padding: 16},
  drawerItemIcon: {
    color: "#000000",
    fontWeight: "900",
  },
});

export default Toolbar;
