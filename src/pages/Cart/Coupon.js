import React, {useState, useEffect} from "react";
import {View, StyleSheet, FlatList, TextInput, Image} from "react-native";
import {Toolbar, Button, Text, Icon, Container, EmptyList} from "components";
import {useSelector} from "react-redux";
import Toast from "react-native-simple-toast";
import {WooCommerce, ApiClient} from "service";
import moment from "moment";

function Coupon({onBackButtonPress, applyCoupon}) {
  const appSettings = useSelector(state => state.appSettings);
  const user = useSelector(state => state.user);
  const [couponCode, setCouponCode] = useState("");
  const [text, setText] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoding] = useState(true);

  useEffect(() => {
    ApiClient.get("/get-coupons")
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

  useEffect(() => {
    if (couponCode == "") return;
    let param = {
      coupon_code: couponCode,
      user_id: user.id,
    };
    ApiClient.get("/cart/coupon", param)
      .then(({data}) => {
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
      .catch(error => {});
  }, [couponCode]);

  const setData = () => {
    setCouponCode(text);
  };

  const _renderItem = ({item, index}) => {
    return (
      <View style={[styles.itemContainer, {marginTop: index > 0 ? 8 : 0, flex: 1}]}>
        <View style={{flex: 1}}>
          <Text style={{fontWeight: "600", fontSize: 14}}> {item.coupon_code.toUpperCase()}</Text>
          {/* <Text style={{fontWeight: "700", fontSize: 18}}>{item.code.toUpperCase()}</Text> */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
              paddingEnd: 8,
              alignItems: "flex-end",
            }}>
            <Text
              style={{
                backgroundColor: "#FEB5B5",
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
              <Text style={{fontSize: 12, color: "grey"}}>Validity:</Text>
              <Text style={{fontSize: 12, color: "grey"}}>
                {item.expiry_date ? moment(item.expiry_date).format("MMMM DD,YYYY") : "no limit"}
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
        <Button style={[styles.itemApplyButton]} onPress={() => setCouponCode(item.coupon_code)}>
          <Text style={{fontWeight: "600"}}>Apply</Text>
        </Button>
      </View>
    );
  };

  const _keyExtractor = item => "Sap" + item.ID;

  return (
    <Container style={{backgroundColor: "#FFF"}}>
      <Toolbar onCancel={onBackButtonPress} cancelButton title="Apply Coupon" />
      <View style={styles.headerContainer}>
        {/* <Icon
          name="brightness-percent"
          type="MaterialCommunityIcons"
          style={{paddingHorizontal: 5, fontSize: 24}}
        /> */}
        <Image
          source={require("../../assets/imgs/coupon.png")}
          style={{width: 25, height: 25, resizeMode: "contain", marginStart: 8}}
        />
        <TextInput
          underlineColorAndroid="transparent"
          onChangeText={text => setText(text)}
          style={{height: 44, marginStart: -20}}
          placeholder="Apply Promo Code/Voucher"
        />
        <Button
          style={[styles.headerApplyButton, {backgroundColor: appSettings.accent_color}]}
          onPress={setData}>
          <Text style={{color: "#fff", fontWeight: "600"}}>Apply</Text>
        </Button>
      </View>
      <FlatList
        data={coupons}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        contentContainerStyle={{padding: 4, flexGrow: 1}}
        ListEmptyComponent={<EmptyList loading={loading} />}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    borderColor: "#d2d2d2",
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
    margin: 10,
    justifyContent: "space-between",
  },
  headerApplyButton: {
    height: 44,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  itemContainer: {
    marginVertical: 4,
    elevation: 2,
    backgroundColor: "#fff",
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
});

export default Coupon;
