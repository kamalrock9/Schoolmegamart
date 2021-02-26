import React, {useState, useEffect} from "react";
import {View, StyleSheet, FlatList, TextInput, Image, ActivityIndicator} from "react-native";
import {Toolbar, Button, Text, Icon, Container, EmptyList} from "components";
import {useSelector} from "react-redux";
import Toast from "react-native-simple-toast";
import {WooCommerce, ApiClient} from "service";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";
import base64 from "base-64";
import Constants from "../../service/Config";
import axios from "axios";

function Coupon({onBackButtonPress, applyCoupon}) {
  const {accent_color, primary_color} = useSelector(state => state.appSettings);
  const user = useSelector(state => state.user);
  const [couponCode, setCouponCode] = useState("");
  const [text, setText] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoding] = useState(true);

  useEffect(() => {
    trackScreenView("Coupon");
    ApiClient.post("/get-coupons")
      .then(({data}) => {
        setLoding(false);
        console.log(data);
        if (data.code) {
          setCoupons(data.data);
        }
      })
      .catch(error => {
        setLoding(false);
      });
  }, []);

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  // useEffect(() => {
  //   if (couponCode == "") return;
  //   let param = {
  //     coupon_code: couponCode,
  //     //user_id: user.id,
  //   };
  //   console.log(param);
  //   setLoding(true);
  //   axios
  //     .get("https://schoolmegamart.com/wp-json/wc/v2/cart/coupon/?coupon_code=" + couponCode, {
  //       headers: {
  //         Authorization:
  //           "Basic " +
  //           base64.encode(Constants.keys.consumerKey + ":" + Constants.keys.consumerSecret),
  //       },
  //     })
  //     .then(({data}) => {
  //       setLoding(false);
  //       if (data.code) {
  //         if (data.message && data.message.length > 0) {
  //           //Toast.show(data.message.join());
  //           Toast.show(data.message[0].notice);
  //         } else if (data.message && data.message !== "") {
  //           Toast.show(data.message);
  //         } else {
  //           Toast.show("Coupon code is not valid.");
  //         }
  //       } else {
  //         applyCoupon && applyCoupon(data);
  //         onBackButtonPress && onBackButtonPress();
  //       }
  //     })
  //     .catch(error => {
  //       setLoding(false);
  //     });
  // }, [couponCode]);

  const setData = () => {
    //setCouponCode(text);
    ApplyCoupon(text);
  };

  const ApplyCoupon = cc => {
    // let param = {
    //   coupon_code: couponCode,
    //   //user_id: user.id,
    // };
    console.log(cc);
    setLoding(true);
    axios
      .get(
        "https://schoolmegamart.com/wp-json/wc/v2/cart/coupon/?coupon_code=" +
          cc +
          "&user_id=" +
          user.id,
        {
          headers: {
            Authorization:
              "Basic " +
              base64.encode(Constants.keys.consumerKey + ":" + Constants.keys.consumerSecret),
          },
        },
      )
      .then(({data}) => {
        setLoding(false);
        console.log(data);
        if (data.code) {
          if (data.message && data.message.length > 0) {
            //Toast.show(data.message.join());
            Toast.show(data.message[0].notice);
          } else if (data.message && data.message !== "") {
            Toast.show(data.message);
          } else {
            Toast.show("Coupon code is not valid.");
          }
        } else {
          applyCoupon && applyCoupon(data);
          onBackButtonPress && onBackButtonPress();
        }
      })
      .catch(error => {
        setLoding(false);
      });
  };

  const SetCouponCode = text => () => {
    console.log(text);
    // setCouponCode(text);
    ApplyCoupon(text);
  };

  const _renderItem = ({item, index}) => {
    return (
      <View style={[styles.itemContainer, {marginTop: index > 0 ? 8 : 8, flex: 1}]}>
        <View style={{flex: 1}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", marginEnd: 8}}>
            <Text style={{fontWeight: "600", fontSize: 14}}> {item.coupon_code.toUpperCase()}</Text>
            <Text style={{fontSize: 12}}>Validity</Text>
          </View>
          <View style={{flexDirection: "row", justifyContent: "flex-end", marginEnd: 8}}>
            <Text style={{fontSize: 12, fontWeight: "600"}}>
              {item.expiry_date ? moment(item.expiry_date.date).format("MMMM") : "no limit"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingEnd: 8,
              alignItems: "flex-end",
            }}>
            <Text
              style={{
                backgroundColor: primary_color,
                borderRadius: 12,
                paddingHorizontal: 8,
                color: "red",
                height: 20,
                fontSize: 10,
                paddingTop: 2,
              }}>
              {item.coupon_code.toUpperCase()}
            </Text>
            <View>
              <Text style={{fontSize: 12, fontWeight: "600"}}>
                {item.expiry_date
                  ? moment(item.expiry_date, "YYYY-MM-DD").format("DD,YYYY")
                  : "no limit"}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: 70,
            //width: 1,
            borderStyle: "dashed",
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderColor: "gray",
            borderRadius: 5,
          }}
        />
        <Button style={[styles.itemApplyButton]} onPress={SetCouponCode(item.coupon_code)}>
          <Text style={{fontWeight: "700"}}>Apply</Text>
        </Button>
      </View>
    );
  };

  const _keyExtractor = item => "Sap" + item.ID;

  return (
    <Container style={{backgroundColor: "#f0f0f0"}}>
      <View style={[styles.containerMain, {backgroundColor: primary_color}]}>
        <Text style={[styles.title, {color: "#000", width: "100%"}]} ellipsizeMode="tail">
          Apply Coupon
        </Text>
        <Button onPress={onBackButtonPress} style={styles.menuButton}>
          <Icon color={"#000"} name="cross" type="Entypo" size={24} />
        </Button>
      </View>
      <View
        style={[
          styles.headerContainer,
          {borderColor: "#adadad", borderWidth: 1, backgroundColor: "#fff"},
        ]}>
        <Image
          source={require("../../assets/imgs/coupon.png")}
          style={{width: 25, height: 25, resizeMode: "contain", marginStart: 8}}
        />
        <TextInput
          underlineColorAndroid="transparent"
          onChangeText={text => setText(text)}
          style={{height: 44, marginStart: 8, flex: 1}}
          placeholder="Apply Promo Code/Voucher"
        />
        <Button
          style={[styles.headerApplyButton, {backgroundColor: accent_color}]}
          onPress={setData}>
          <Text style={{color: "#fff", fontWeight: "400"}}>Apply</Text>
        </Button>
      </View>
      {loading ? (
        <ActivityIndicator
          style={{flex: 1, backgroundColor: "transparent"}}
          size={"large"}
          color={accent_color}
        />
      ) : (
        <FlatList
          data={coupons}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
          contentContainerStyle={{padding: 4, flexGrow: 1, backgroundColor: "#f0f0f0"}}
          ListEmptyComponent={<EmptyList loading={loading} label={"No coupons are available"} />}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    //borderColor: "#d2d2d2",
    //borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 12,
    justifyContent: "space-between",
  },
  headerApplyButton: {
    height: 44,
    paddingHorizontal: 30,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  itemContainer: {
    marginVertical: 4,
    // elevation: 2,
    // backgroundColor: "#fff",
    borderColor: "#adadad",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  itemApplyButton: {
    // elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingBottom: 3,
    marginHorizontal: 16,
  },
  containerMain: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    // paddingVertical: 4,
    // paddingTop: 24,
    paddingHorizontal: 12,
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
  menuButton: {paddingVertical: 16, paddingStart: 16},
  drawerItemIcon: {
    color: "#000000",
    fontWeight: "900",
  },
});

export default Coupon;
