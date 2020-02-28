import React, {Fragment, useState} from 'react';
import {View, StyleSheet, FlatList, Image, ScrollView, Alert} from 'react-native';
import {Toolbar, Button, Text, Icon} from '../../components';
import {connect} from 'react-redux';
import {ApiClient} from '../../service';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';

class Cart extends React.PureComponent {
  static navigationOptions = {
    header: <Toolbar backButton title="Cart" />,
  };
  constructor(props) {
    super(props);
    this.state = {
      couponCode: '',
      cart_data: [{name: 'cap'}, {name: 'Bat'}, {name: 'Apple'}],
      isChecked: true,
      isCoupon: false,
    };
  }

  componentDidMount() {
    console.log('hello');
    ApiClient.get('/cart').then(res => {
      console.log(res);
    });
  }

  _applyCoupon = key => () => {
    console.log(key);
    this.setState({isCoupon: key});
  };

  couponName = text => {
    this.setState({couponCode: text, isCoupon: false});
  };

  _renderItem = ({item, index}) => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '100%',
            paddingTop: index == 0 ? 16 : 0,
            paddingHorizontal: 16,
          }}>
          <Image
            style={{height: 70, width: 70}}
            source={{
              uri:
                'https://media.gettyimages.com/photos/vintage-clothes-on-clothes-rail-in-antique-and-vintage-emporium-picture-id748316031?s=612x612',
            }}
          />
          <View style={{marginStart: 16, flex: 1}}>
            <Text style={{fontWeight: '700'}}>{item.name}</Text>
            <Text>This is simple product</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
                marginTop: 10,
              }}>
              <Text>Price: $35.00</Text>
              <View style={{flexDirection: 'row'}}>
                <Button style={styles.btn}>
                  <Text style={styles.btnTxt}>–</Text>
                </Button>
                <Text style={{paddingHorizontal: 8}}>1</Text>
                <Button style={styles.btn}>
                  <Text style={styles.btnTxt}>+</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  _itemSeparatorComponent = () => {
    return (
      <View
        style={[
          styles.line,
          {
            marginStart: 96,
            marginVertical: 8,
          },
        ]}
      />
    );
  };

  _renderFooter = () => {
    const {couponCode} = this.state;
    //Alert.alert(couponCode);
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
            <Button style={{flexDirection: 'row'}} onPress={this._applyCoupon(true)}>
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
                <Text style={{paddingHorizontal: 5, color: 'green'}}>{couponCode}</Text>
                <Text style={{marginHorizontal: 5}}>applied</Text>
              </View>
              <Button style={{padding: 16}} onPress={() => this.setState({couponCode: ''})}>
                <Icon name="cross" type="Entypo" size={22} />
              </Button>
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
          <View
            style={[
              styles.line,
              {
                marginVertical: 3,
              },
            ]}
          />
          <View style={[styles.view, {marginVertical: 5}]}>
            <Text style={styles.heading}>Total</Text>
            <Text style={styles.heading}>$55.55</Text>
          </View>
          <View
            style={[
              styles.line,
              {
                marginVertical: 3,
              },
            ]}
          />
        </View>
      </>
    );
  };

  _keyExtractor = (item, index) => item + 'sap' + index;

  render() {
    const {cart_data, couponCode} = this.state;
    const {appSettings} = this.props;
    return (
      <>
        <View style={styles.container}>
          <FlatList
            data={cart_data}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            ItemSeparatorComponent={this._itemSeparatorComponent}
            ListFooterComponent={this._renderFooter}
          />

          <View style={styles.footer}>
            <Fragment>
              <Button
                style={[
                  styles.footerButton,
                  {
                    backgroundColor: appSettings.accent_color,
                  },
                ]}>
                <Text style={{color: 'white'}}>CHECKOUT {' | '} #55.00</Text>
              </Button>
            </Fragment>
          </View>
        </View>

        <Modal
          style={{backgroundColor: '#fff', flex: 1}}
          isVisible={this.state.isCoupon}
          onBackButtonPress={this._applyCoupon(false)}>
          <Coupon
            appSettings={appSettings}
            submit={this._applyCoupon(false)}
            couponName={this.couponName}
            adultCount={this.state.adult}
            childrenCount={this.state.children}
            infantsCount={this.state.infants}
            onModalBackPress={this._applyCoupon(false)}
          />
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  appSettings: state.appSettings,
});

export default connect(mapStateToProps)(Cart);

function Coupon({submit, appSettings, couponName}) {
  const [text, setText] = useState('');

  const setData = () => {
    if (text != '') {
      couponName && couponName(text);
    } else {
      Toast.show('Please enter the Promo Code/Voucher');
    }
  };

  return (
    <View style={{flex: 1}}>
      <Toolbar submit={submit} cancelButton title="Apply Coupon" />
      <View style={{elevation: 5, backgroundColor: '#ffff'}}>
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="brightness-percent"
              type="MaterialCommunityIcons"
              size={24}
              style={{paddingHorizontal: 5}}
            />
            <TextInput
              underlineColorAndroid="transparent"
              style={{}}
              onChangeText={text => setText(text)}
              placeholder="Apply Promo Code/Voucher"
            />
          </View>
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
  view: {flexDirection: 'row', justifyContent: 'space-between'},
  line: {height: 1, width: '100%', backgroundColor: '#F1F1F1'},
  btnTxt: {fontWeight: '600', fontSize: 24, marginBottom: 5},
});
