import React from "react";
import {View, StyleSheet, FlatList} from "react-native";
import {
  Toolbar,
  Button,
  Text,
  HTMLRender,
  Container,
  Icon,
  EmptyList,
  ProgressDialog,
} from "components";
import {connect} from "react-redux";
import {ApiClient} from "service";
import CartPriceBreakup from "./CartPriceBreakup";
import CartItem from "./CartItem";
import {isArray, isEmpty} from "lodash";
import {withTranslation} from "react-i18next";
import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import {deleteItemCart} from "../../store/actions/index";
import analytics from "@react-native-firebase/analytics";
import base64 from "base-64";
import Constants from "../../service/Config";
import axios from "axios";

class Cart extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      cart_data: {},
      loading: false,
      updating: false,
      isContactModalOpen: false,
      shipping_method: "",
      refreshing: false,
    };
  }

  selectShipping = text => {
    this.setState({shipping_method: text});
    this.ApiCall(text);
  };

  componentDidMount() {
    this.trackScreenView("Cart");
    this.ApiCall(null);
  }

  _handleRefresh = () => {
    this.ApiCall(null);
  };

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  gotoCheckout = (route, param) => () => {
    if (isEmpty(this.props.user)) {
      this.toggleContactModal();
    } else {
      this.props.navigation.navigate(route, {cartData: param});
    }
  };

  gotoAuth = (login, register) => () => {
    this.setState({isContactModalOpen: !this.state.isContactModalOpen});
    this.props.navigation.navigate("Auth", {NeedLogin: login, NeedRegister: register});
  };

  toggleContactModal = () => {
    this.setState({isContactModalOpen: !this.state.isContactModalOpen});
  };

  ApiCall = params => {
    // let param = {
    //   shipping_method: params ? params : "",
    //   user_id: 17,
    // };
    this.setState({loading: true});
    axios
      .get("https://schoolmegamart.com/wp-json/wc/v2/cart", {
        headers: {
          Authorization:
            "Basic " +
            base64.encode(Constants.keys.consumerKey + ":" + Constants.keys.consumerSecret),
        },
      })
      .then(({data}) => {
        console.log(data);
        this.setState({loading: false, cart_data: data});
      })
      .catch(() => {
        this.setState({loading: false});
      });
  };

  manageQuanity = (key, quantity) => {
    this.setState({updating: true});
    ApiClient.get("/cart/update", {
      cart_item_key: key,
      quantity: quantity,
    })
      .then(({data}) => {
        this.setState({cart_data: data, updating: false});
      })
      .catch(error => {
        this.setState({updating: false});
        Toast.show("Something went wrong!");
      });
  };

  deleteCartItem = key => {
    this.setState({updating: true});
    ApiClient.get("/cart/remove", {cart_item_key: key})
      .then(({data}) => {
        console.log("delete item");
        console.log(data);
        this.setState({cart_data: data, updating: false});
        this.props.deleteItemCart(1);
      })
      .catch(error => {
        this.setState({updating: false});
        Toast.show("Something went wrong!");
      });
  };

  applyCoupon = cart_data => {
    this.setState({cart_data});
  };
  removeCoupon = coupon_code => {
    console.log(coupon_code);
    this.setState({updating: true});
    ApiClient.get("/cart/remove-coupon", {coupon_code})
      .then(({data}) => {
        this.setState({cart_data: data, updating: false});
      })
      .catch(error => {
        this.setState({updating: false});
        Toast.show("Something went wrong!");
      });
  };

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  renderItem = ({item, index}) => {
    return (
      <View
        style={{
          // elevation: 2,
          // backgroundColor: "white",
          borderColor: "#adadad",
          borderWidth: 1,
          //marginHorizontal: 16,
          padding: 16,
          marginTop: index == 0 ? 16 : 0,
          borderTopLeftRadius: index == 0 ? 8 : 0,
          borderTopRightRadius: index == 0 ? 8 : 0,
          borderBottomLeftRadius: this.state.cart_data.cart_data.length - 1 == index ? 8 : 0,
          borderBottomRightRadius: this.state.cart_data.cart_data.length - 1 == index ? 8 : 0,
        }}>
        <CartItem
          item={item}
          index={index}
          manageQuanity={this.manageQuanity}
          deleteCartItem={this.deleteCartItem}
        />
      </View>
    );
  };

  renderFooter = () => (
    <CartPriceBreakup
      data={this.state.cart_data}
      applyCoupon={this.applyCoupon}
      removeCoupon={this.removeCoupon}
      shippingMethod={this.selectShipping}
    />
  );

  render() {
    const {cart_data, isContactModalOpen, loading, updating} = this.state;
    const {appSettings, user} = this.props;
    const isListAvailable =
      cart_data.cart_data && isArray(cart_data.cart_data) && !isEmpty(cart_data.cart_data);
    return (
      <>
        <Container>
          <Toolbar backButton title="CART" />
          <FlatList
            refreshing={this.state.refreshing}
            onRefresh={this._handleRefresh}
            data={cart_data.cart_data}
            renderItem={this.renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparatorComponent}
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: "#FAFAFA",
              paddingHorizontal: 16,
            }}
            ListFooterComponent={isListAvailable && this.renderFooter}
            ListEmptyComponent={
              <EmptyList
                loading={loading}
                label="Cart is empty."
                iconName="md-cart"
                iconType="Ionicons"
              />
            }
          />
          {isListAvailable && (
            <Button
              style={[styles.footerButton, {backgroundColor: appSettings.accent_color}]}
              onPress={this.gotoCheckout("CheckoutScreen", this.state.cart_data)}>
              <Text style={{color: "#fff", fontWeight: "600"}}>CHECKOUT {" | "}</Text>
              <HTMLRender
                html={cart_data.total}
                baseFontStyle={{color: "#fff", fontWeight: "600"}}
              />
            </Button>
          )}

          <ProgressDialog loading={updating} />
        </Container>
        <Modal
          isVisible={isContactModalOpen}
          style={{justifyContent: "flex-end", margin: 0, marginTop: "auto"}}
          onBackButtonPress={this.toggleContactModal}
          onBackdropPress={this.toggleContactModal}
          hasBackdrop
          useNativeDriver
          hideModalContentWhileAnimating>
          <View style={{backgroundColor: "#FFF", padding: 10}}>
            <Text style={{fontSize: 18, fontWeight: "400"}}>LOGIN</Text>
            <Text style={{marginVertical: 5}}>You need to login/register first.</Text>
            <View
              style={{
                height: 1.35,
                backgroundColor: "#d2d2d2",
                width: "100%",
                marginVertical: 10,
              }}
            />
            <View style={{flexDirection: "row"}}>
              <Button
                style={[styles.contact_btn, {backgroundColor: appSettings.primary_color}]}
                onPress={this.gotoAuth(true, false)}>
                <Text style={{color: "#000"}}>LOGIN</Text>
              </Button>
              <Button
                style={[styles.contact_btn, {backgroundColor: appSettings.accent_color}]}
                onPress={this.gotoAuth(true, true)}>
                <Text style={{color: "#fff"}}>REGISTER</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const keyExtractor = item => item.cart_item_key;

function ItemSeparatorComponent() {
  return <View style={[styles.line, {marginHorizontal: 24, paddingHorizontal: 16}]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    borderWidth: 1,
    borderColor: "#D2d2d9",
    backgroundColor: "#D2d2d2",
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {fontWeight: "700"},
  footer: {
    width: "100%",
    flexDirection: "row",
  },
  footerButton: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: "#F1F1F1",
  },
  btnTxt: {
    fontWeight: "600",
    fontSize: 24,
    marginBottom: 5,
  },
  contact_btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 2,
  },
});

const mapStateToProps = state => ({
  appSettings: state.appSettings,
  user: state.user,
});

const mapDispatchToProps = {
  deleteItemCart,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Cart));
