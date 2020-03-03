import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, Image, TextInput} from 'react-native';
import {Toolbar, Button, Text, Icon} from '../../components';
import {useSelector} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {WooCommerce, ApiClient} from '../../service';
import moment from 'moment';

function Coupon({submit, couponSubmit}) {
  const appSettings = useSelector(state => state.appSettings);
  const [text, setText] = useState('');
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    WooCommerce.get('coupons')
      .then(({data}) => {
        console.log(data);
        setCoupons(data);
      })
      .catch(error => {});
  }, []);

  const setData = () => {
    if (text != '') {
      let param = {
        coupon_code: text,
        user_id: 17,
      };
      ApiCall(param);
    } else {
      Toast.show('Please enter the Promo Code/Voucher');
    }
  };

  const ApiCall = param => {
    ApiClient.get('/cart/coupon', param)
      .then(({data}) => {
        console.log(data);
        if (data.code == 201) {
          Toast.show(data.message[0].notice);
        } else {
          couponSubmit && couponSubmit(text);
        }
      })
      .catch(error => {});
  };

  const setCoupon = code => () => {
    let param = {
      coupon_code: code,
      user_id: 17,
    };
    ApiCall(param);
  };

  const _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          marginHorizontal: 8,
          elevation: 2,
          backgroundColor: '#fff',
          marginTop: 10,
          marginBottom: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
        }}>
        <View>
          <Text style={{fontWeight: '700', fontSize: 18}}>{item.code.toUpperCase()}</Text>
          <Text>{item.description}</Text>
          <Text>Valid Till {moment(item.date_expires).format('MMM DD,YYYY')}</Text>
        </View>
        <Button
          style={{
            backgroundColor: appSettings.accent_color,
            elevation: 2,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            paddingHorizontal: 5,
            paddingBottom: 3,
          }}
          onPress={setCoupon(item.code)}>
          <Text style={{color: '#fff'}}>Apply</Text>
        </Button>
      </View>
    );
  };

  const _keyExtractor = (item, index) => item.id;

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <Toolbar submit={submit} cancelButton title="Apply Coupon" />
      <View style={{elevation: 2, backgroundColor: '#ffff', marginBottom: 10}}>
        <View
          style={{
            flexDirection: 'row',
            borderColor: '#d2d2d2',
            borderWidth: 1,
            borderRadius: 4,
            alignItems: 'center',
            margin: 10,
            justifyContent: 'space-between',
          }}>
          <Icon
            name="brightness-percent"
            type="MaterialCommunityIcons"
            size={24}
            style={{paddingHorizontal: 5}}
          />
          <TextInput
            underlineColorAndroid="transparent"
            style={{flex: 1}}
            onChangeText={text => setText(text)}
            placeholder="Apply Promo Code/Voucher"
          />
          <Button
            style={{
              backgroundColor: appSettings.accent_color,
              alignItems: 'flex-end',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
            }}
            onPress={setData}>
            <Text style={{paddingHorizontal: 30, color: '#fff', marginBottom: 5}}>Apply</Text>
          </Button>
        </View>
      </View>
      <FlatList data={coupons} renderItem={_renderItem} keyExtractor={_keyExtractor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#D2d2d9',
    backgroundColor: '#D2d2d2',
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {fontWeight: '700'},
  footer: {
    width: '100%',
    flexDirection: 'row',
  },
  footerButton: {
    flex: 1,
    height: 40,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#F1F1F1',
  },
  btnTxt: {
    fontWeight: '600',
    fontSize: 24,
    marginBottom: 5,
  },
});

export default Coupon;
