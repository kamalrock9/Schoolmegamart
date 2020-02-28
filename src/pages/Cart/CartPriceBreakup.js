import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Toolbar, Button, Text, Icon} from '../../components';
import {connect} from 'react-redux';
import {ApiClient} from '../../service';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import Coupon from './Coupon';

function CartPriceBreakup({couponCode}) {
  // const {couponCode} = this.state
  const [isCoupon, setIsCoupon] = useState(false);
  //Alert.alert(couponCode);

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
          <Text>Flat Rate</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>#20.00</Text>
            <Icon name="md-radio-button-on" size={18} style={{marginStart: 5}} />
          </View>
        </View>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Text>Free Shipping</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>#0.00</Text>
            <Icon name="md-radio-button-off" size={18} style={{marginStart: 5}} />
          </View>
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
          <Text>#53.00</Text>
        </View>
        <View style={styles.view}>
          <Text>Shipping Charge</Text>
          <Text>#53.00</Text>
        </View>
        <View style={styles.view}>
          <Text>Tax</Text>
          <Text>#53.00</Text>
        </View>
        <View style={styles.view}>
          <Text>Total Discount</Text>
          <Text>#53.00</Text>
        </View>
        <View style={[styles.line, {marginVertical: 3}]} />
        <View style={[styles.view, {marginVertical: 5}]}>
          <Text style={styles.heading}>Total</Text>
          <Text style={styles.heading}>$55.55</Text>
        </View>
        <View style={[styles.line, {marginVertical: 3}]} />
      </View>

      <Modal
        style={{backgroundColor: '#fff', flex: 1}}
        isVisible={isCoupon}
        onBackButtonPress={toggleCouponModal}>
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
