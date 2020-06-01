import React, {useState, useEffect} from "react";
import {View, StyleSheet, FlatList, TextInput} from "react-native";
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
    WooCommerce.get("coupons")
      .then(({data}) => {
        setLoding(false);
        setCoupons(data);
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
            Toast.show(data.message.join());
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
      <View style={styles.itemContainer}>
        <View>
          <Text style={{fontWeight: "700", fontSize: 18}}>{item.code.toUpperCase()}</Text>
          <Text>{item.description}</Text>
          <Text>
            Valid till{" - "}
            {item.date_expires ? moment(item.date_expires).format("MMM DD,YYYY") : "no limit"}
          </Text>
        </View>
        <Button
          style={[styles.itemApplyButton, {backgroundColor: appSettings.accent_color}]}
          onPress={() => setCouponCode(item.code)}>
          <Text style={{color: "#fff"}}>Apply</Text>
        </Button>
      </View>
    );
  };

  const _keyExtractor = (item, index) => item.id;

  return (
    <Container style={{backgroundColor: "#FFF"}}>
      <Toolbar onCancel={onBackButtonPress} cancelButton title="Apply Coupon" />
      <View style={styles.headerContainer}>
        <Icon
          name="brightness-percent"
          type="MaterialCommunityIcons"
          style={{paddingHorizontal: 5, fontSize: 24}}
        />
        <TextInput
          underlineColorAndroid="transparent"
          onChangeText={text => setText(text)}
          style={{height: 44}}
          placeholder="Apply Promo Code/Voucher"
        />
        <Button
          style={[styles.headerApplyButton, {backgroundColor: appSettings.accent_color}]}
          onPress={setData}>
          <Text style={{color: "#fff"}}>Apply</Text>
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
  },
  itemApplyButton: {
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingBottom: 3,
  },
});

export default Coupon;
