import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Text, Icon, Html} from '../../components';
import Modal from 'react-native-modal';
import Coupon from './Coupon';

function CartPriceBreakup({couponCode, data}) {
  console.log(data);
  const [isCoupon, setIsCoupon] = useState(false);
  const [isSelectShipping, setShippingMethod] = useState(0);

  const toggleCouponModal = () => {
    setIsCoupon(!isCoupon);
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

        {couponCode != '' && (
          <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{paddingHorizontal: 5, color: 'green'}}>{couponCode || ''}</Text>
              <Text style={{marginHorizontal: 5}}>applied</Text>
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
                    <Html html={item.shipping_method_price} />
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
          <Html html={data.cart_subtotal} />
        </View>
        <View style={styles.view}>
          <Text>Shipping Charge</Text>
          {/* <Html html={data.shipping_method[isSelectShipping].shipping_method_price} /> */}
        </View>
        <View style={styles.view}>
          <Text>Tax</Text>
          <Html html={data.taxes} />
        </View>
        <View style={styles.view}>
          <Text>Total Discount</Text>
          <Html html={data.discount_total} />
        </View>
        <View style={[styles.line, {marginVertical: 3}]} />
        <View style={[styles.view, {marginVertical: 5}]}>
          <Text style={styles.heading}>Total</Text>
          <Html html={data.total} />
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
          // couponName={this.couponName}
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
