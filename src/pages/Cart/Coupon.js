import React, {useCallback, useState} from 'react';
import {View, StyleSheet, FlatList, Image, TextInput} from 'react-native';
import {Toolbar, Button, Text, Icon} from '../../components';
import {useSelector} from 'react-redux';
import {ApiClient} from '../../service';
import Toast from 'react-native-simple-toast';

function Coupon({submit, couponName}) {
  const appSettings = useSelector(state => state.appSettings);
  const [text, setText] = useState('');

  const setData = () => {
    if (text != '') {
      couponName && couponName(text);
    } else {
      Toast.show('Please enter the Promo Code/Voucher');
    }
  };

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
