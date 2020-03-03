import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Text, Icon, HTMLRender} from '../../components';
import Modal from 'react-native-modal';
import Coupon from './Coupon';
import {isEmpty} from 'lodash';
import {ApiClient} from '../../service';

function CartPriceBreakup({couponCode, data, quantityIncrementDecremnt}) {
  // console.log(data);
  const [isCoupon, setIsCoupon] = useState(false);
  const [isSelectShipping, setShippingMethod] = useState(0);

  const toggleCouponModal = () => {
    setIsCoupon(!isCoupon);
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
    ApiClient.get('/cart/remove-coupon', param)
      .then(res => {
        console.log(res);
        quantityIncrementDecremnt && quantityIncrementDecremnt();
      })
      .catch(error => {});
  };

  return (
    <>
      <View
        style={{
          paddingHorizontal: 10,
          elevation: 2,
          backgroundColor: '#fff',
          marginHorizontal: 16,
          marginTop: 16,
          borderRadius: 5,
          justifyContent: 'center',
          paddingVertical: 20,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            justifyContent: 'space-between',
          }}>
          <Button style={{flexDirection: 'row'}} onPress={toggleCouponModal}>
            <Icon
              name="brightness-percent"
              type="MaterialCommunityIcons"
              size={24}
              style={{paddingHorizontal: 5}}
            />
            <Text>Apply Promo Code/Vouncher</Text>
          </Button>
          <Icon name="ios-arrow-forward" size={24} />
        </TouchableOpacity>

        {!isEmpty(data.coupon) && (
          <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{paddingHorizontal: 5, color: 'green'}}>{couponCode || ''}</Text>
              {data.coupon.map((item, index) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#d2d2d2',
                      padding: 10,
                      marginEnd: 10,
                    }}
                    key={item.code}>
                    <Text style={{color: 'green'}}>{item.code}</Text>
                    <Text style={{marginHorizontal: 5}}>applied</Text>
                    <Button onPress={removeCoupon(item.code)}>
                      <Icon type="MaterialIcons" name="cancel" size={22} />
                    </Button>
                  </View>
                );
              })}
            </View>
            {/* <Button style={{padding: 16}} onPress={() => this.setState({couponCode: ''})}>
              <Icon name="cross" type="Entypo" size={22} />
            </Button> */}
          </View>
        )}
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          elevation: 2,
          marginHorizontal: 16,
          marginTop: 16,
          padding: 16,
          borderRadius: 5,
        }}>
        <Text style={styles.heading}>Shipping Method(S)</Text>
        <View style={{justifyContent: 'space-between', flexDirection: 'row', marginTop: 5}}>
          {data &&
            data != '' &&
            data.shipping_method.map((item, index) => {
              return (
                <View
                  key={item.method_id}
                  style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
                  <Text>{item.shipping_method_name}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <HTMLRender html={item.shipping_method_price} />
                    <Icon name="md-radio-button-on" size={18} style={{marginStart: 5}} />
                  </View>
                </View>
              );
            })}
        </View>
        <Text style={{alignSelf: 'flex-end', textDecorationLine: 'underline'}}>
          Calculate Shipping
        </Text>
      </View>
      <View
        style={{
          marginHorizontal: 16,
          marginVertical: 16,
          padding: 16,
          elevation: 2,
          borderRadius: 5,
          backgroundColor: '#fff',
        }}>
        <Text style={styles.heading}>Order Summary</Text>
        <View style={[styles.view, {marginTop: 5}]}>
          <Text>Subtotal</Text>
          <HTMLRender html={data.cart_subtotal} />
        </View>
        <View style={styles.view}>
          <Text>Shipping Charge</Text>
          <HTMLRender html={data.shipping_method[isSelectShipping].shipping_method_price} />
        </View>
        <View style={styles.view}>
          <Text>Tax</Text>
          <HTMLRender html={data.taxes} />
        </View>
        <View style={styles.view}>
          <Text>Total Discount</Text>
          <HTMLRender html={data.discount_total} />
        </View>
        <View style={[styles.line, {marginVertical: 3}]} />
        <View style={[styles.view, {marginVertical: 5}]}>
          <Text style={styles.heading}>Total</Text>
          <HTMLRender html={data.total} />
        </View>
        <View style={[styles.line, {marginVertical: 3}]} />
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
  heading: {fontWeight: '700'},

  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#F1F1F1',
  },
});

export default CartPriceBreakup;
