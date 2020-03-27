import React from "react";
import {View, StyleSheet, FlatList, ActivityIndicator} from "react-native";
import {Toolbar, Button, Text, HTMLRender, Container} from "components";
import {connect} from "react-redux";
import {ApiClient} from "service";
import CartPriceBreakup from "./CartPriceBreakup";
import CartItem from "./CartItem";
import {isArray, isEmpty} from "lodash";
import {withTranslation} from "react-i18next";

class Cart extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      cart_data: [],
      loading: false,
      shipping_method: "",
    };
  }

  selectShipping = text => {
    this.setState({shipping_method: text});
    this.ApiCall(text);
  };

  componentDidMount() {
    this.ApiCall(null);
  }

  gotoCheckout = (route, param) => () => {
    this.props.navigation.navigate(route, param);
  };

  ApiCall = params => {
    let param = {
      shipping_method: params ? params : "",
      user_id: 17,
    };

    this.setState({loading: true});
    ApiClient.get("/cart", param)
      .then(({data}) => {
        console.log(data);
        this.setState({loading: false, cart_data: data});
      })
      .catch(() => {
        this.setState({loading: false});
      });
  };

  quantityIncrementDecremnt = () => {
    this.ApiCall(null);
  };

  renderItem = ({item, index}) => (
    <CartItem
      item={item}
      index={index}
      quantityIncrementDecremnt={this.quantityIncrementDecremnt}
    />
  );

  renderFooter = () => (
    <CartPriceBreakup
      data={this.state.cart_data}
      quantityIncrementDecremnt={this.quantityIncrementDecremnt}
      shippingMethod={this.selectShipping}
    />
  );

  render() {
    const {cart_data, couponCode, loading} = this.state;
    const {appSettings} = this.props;
    return (
      <Container>
        <Toolbar backButton title="Cart" />
        {loading ? (
          <View style={[styles.container, {alignItems: "center", justifyContent: "center"}]}>
            <ActivityIndicator size={"large"} />
          </View>
        ) : isArray(cart_data.cart_data) && !isEmpty(cart_data.cart_data) ? (
          <>
            <FlatList
              data={cart_data.cart_data}
              renderItem={this.renderItem}
              keyExtractor={keyExtractor}
              ItemSeparatorComponent={ItemSeparatorComponent}
              ListFooterComponent={this.renderFooter}
            />
            <View style={styles.footer}>
              <Button
                style={[styles.footerButton, {backgroundColor: appSettings.accent_color}]}
                onPress={this.gotoCheckout}>
                <Text style={{color: "white", marginEnd: 5}}>CHECKOUT {" | "}</Text>
                <HTMLRender html={cart_data.total} baseFontStyle={{color: "#fff"}} />
              </Button>
            </View>
          </>
        ) : (
          <View style={[styles.container, {alignItems: "center", justifyContent: "center"}]}>
            <Text>Cart is empty</Text>
          </View>
        )}
      </Container>
    );
  }
}

const keyExtractor = (item, index) => item + "sap" + index;

function ItemSeparatorComponent() {
  return <View style={[styles.line, {margin: 16}]} />;
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
    flex: 1,
    height: 40,
    margin: 5,
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
    width: "100%",
    backgroundColor: "#F1F1F1",
  },
  btnTxt: {
    fontWeight: "600",
    fontSize: 24,
    marginBottom: 5,
  },
});

const mapStateToProps = state => ({
  appSettings: state.appSettings,
});

export default connect(mapStateToProps)(withTranslation()(Cart));
