import React, {useState} from "react";
import {View, StyleSheet, Dimensions} from "react-native";
import {Button, Text, Icon, HTMLRender} from "components";
import Modal from "react-native-modal";
import Coupon from "./Coupon";
import {isEmpty} from "lodash";
import {ApiClient} from "service";

const {width} = Dimensions.get("window");

function CartPriceBreakup({couponCode, data, quantityIncrementDecremnt, shippingMethod}) {
  // console.log(data);
  const [isCoupon, setIsCoupon] = useState(false);
  const [isSelectShipping, setShippingMethod] = useState(data.chosen_shipping_method);

  const toggleCouponModal = () => {
    setIsCoupon(!isCoupon);
  };

  const selectShippingMethod = item => () => {
    setShippingMethod(item.id);
    console.log(item);
    shippingMethod && shippingMethod(item.id);
  };

  const couponSubmit = text => {
    console.log(text);
    setIsCoupon(!isCoupon);
    quantityIncrementDecremnt && quantityIncrementDecremnt();
  };

  const removeCoupon = code => () => {
    let param = {
      coupon_code: code,
    };
    ApiClient.get("/cart/remove-coupon", param)
      .then(res => {
        console.log(res);
        quantityIncrementDecremnt && quantityIncrementDecremnt();
      })
      .catch(error => {});
  };

  return (
    <>
      <View style={styles.card}>
        <Button
          style={{
            flexDirection: "row",
            paddingVertical: 8,
            alignItems: "center",
            width: "100%",
          }}
          onPress={toggleCouponModal}>
          <Icon name="brightness-percent" type="MaterialCommunityIcons" size={24} />
          <Text>Apply Promo Code/Vouncher</Text>
          <Icon name="ios-arrow-forward" size={24} style={{marginStart: "auto"}} />
        </Button>

        {!isEmpty(data.coupon) && (
          <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            {data.coupon.map((item, index) => {
              return (
                <View style={styles.couponContainer} key={item.code}>
                  <Text>
                    <Text style={{color: "green"}}>{item.code}</Text> applied{" "}
                  </Text>
                  <Button onPress={removeCoupon(item.code)}>
                    <Icon type="MaterialIcons" name="cancel" size={22} />
                  </Button>
                </View>
              );
            })}
          </View>
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.heading}>Shipping Method(S)</Text>
        {!isEmpty(data.shipping_method) &&
          data.shipping_method.map((item, index) => {
            return (
              <View
                key={item.method_id}
                style={{flexDirection: "row", width: "100%", alignItems: "center"}}>
                <Text style={{flex: 1}}>{item.shipping_method_name}</Text>
                <HTMLRender
                  html={item.shipping_method_price ? item.shipping_method_price : <b></b>}
                />
                <Button onPress={selectShippingMethod(item)} style={{paddingVertical: 4}}>
                  <Icon
                    name={
                      data.chosen_shipping_method == item.id
                        ? "md-radio-button-on"
                        : "md-radio-button-off"
                    }
                    size={18}
                    style={{marginStart: 5}}
                  />
                </Button>
              </View>
            );
          })}

        <Text
          style={{
            alignSelf: "flex-end",
            textDecorationLine: "underline",
          }}>
          Calculate Shipping
        </Text>
      </View>

      <View style={[styles.card, {marginBottom: 8}]}>
        <Text style={styles.heading}>Order Summary</Text>
        <View style={[styles.view, {marginTop: 5}]}>
          <Text>Subtotal</Text>
          <HTMLRender html={data.cart_subtotal} />
        </View>
        <View style={styles.view}>
          <Text>Shipping Charge</Text>
          <HTMLRender
            html={
              data.shipping_method.find(item => item.id == data.chosen_shipping_method)
                .shipping_method_price
            }
          />
        </View>
        <View style={styles.view}>
          <Text>Tax</Text>
          <HTMLRender html={data.taxes} />
        </View>
        <View style={styles.view}>
          <Text style={{color: "green"}}>Total Discount</Text>
          <HTMLRender html={data.discount_total} baseFontStyle={{color: "green"}} />
        </View>
        <View style={[styles.line, {marginVertical: 3}]} />
        <View style={styles.view}>
          <Text style={[styles.heading, {marginBottom: 0}]}>Total</Text>
          <HTMLRender html={data.total} />
        </View>
      </View>

      <Modal
        style={{margin: 0}}
        isVisible={isCoupon}
        onBackButtonPress={toggleCouponModal}
        useNativeDriver
        hideModalContentWhileAnimating
        coverScreen>
        <Coupon
          submit={toggleCouponModal}
          couponSubmit={couponSubmit}
          onModalBackPress={toggleCouponModal}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontWeight: "700",
    marginBottom: 8,
  },

  view: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  line: {
    height: 1,
    width: "100%",
    backgroundColor: "#F1F1F1",
  },

  card: {
    elevation: 2,
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 5,
    width: width - 32,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  couponContainer: {
    flexDirection: "row",
    backgroundColor: "#efefef",
    padding: 8,
    marginEnd: 8,
    marginTop: 8,
    borderRadius: 2,
  },
});

export default CartPriceBreakup;
