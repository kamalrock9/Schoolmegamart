import React, {Component, Fragment} from 'react';
import {View, StyleSheet, FlatList, Image, ScrollView} from 'react-native';
import {Toolbar, Button, Text, Icon} from '../../components';
import {getCart} from '../../../rest';
import {connect} from 'react-redux';

class Cart extends Component {
  static navigationOptions = {
    header: <Toolbar backButton title="Cart" />,
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [{name: 'cap'}, {name: 'Bat'}, {name: 'Apple'}],
      isChecked: true,
    };
  }

  componentDidMount() {
    getCart()
      .then(response => {
        console.log(response);
        // this.setState({data: response.cart_data});
      })
      .catch(error => {
        console.log(error);
      });
  }

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
                  <Text>-</Text>
                </Button>
                <Text style={{paddingHorizontal: 8}}>1</Text>
                <Button style={styles.btn}>
                  <Text>+</Text>
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

  _keyExtractor = (item, index) => item + 'sap' + index;

  render() {
    const {data} = this.state;
    const {appSettings} = this.props;
    return (
      <>
        <ScrollView style={styles.container}>
          <FlatList
            data={data}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            ItemSeparatorComponent={this._itemSeparatorComponent}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              elevation: 2,
              backgroundColor: '#fff',
              marginHorizontal: 16,
              marginTop: 16,
              borderRadius: 5,
              paddingVertical: 20,
            }}>
            <Text>Apply Promo Code/Vouncher</Text>
            <Icon name="ios-arrow-forward" size={24} />
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
              <Text>#20.00</Text>
            </View>
            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text>Free Shipping</Text>
              <Text>#0.00</Text>
            </View>
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
        </ScrollView>

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
      </>
    );
  }
}

const mapStateToProps = state => ({
  appSettings: state.appSettings,
});

export default connect(mapStateToProps)(Cart);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  btn: {
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
    height: 45,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {flexDirection: 'row', justifyContent: 'space-between'},
  line: {height: 1, width: '100%', backgroundColor: '#F1F1F1'},
});
