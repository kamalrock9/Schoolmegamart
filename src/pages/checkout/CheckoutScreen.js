import React, {useState, useCallback, useEffect} from "react";
import {View, StyleSheet, Dimensions, Switch, ActivityIndicator} from "react-native";
import {Text, Toolbar, Container, Button, Icon} from "components";
import {useSelector, useDispatch} from "react-redux";
import BillingAddress from "./BillingAddress";
import ShippingAddress from "./ShippingAddress";
import Review from "../Review";
import StepIndicator from "react-native-step-indicator";
import SwiperFlatList from "react-native-swiper-flatlist";
import Toast from "react-native-simple-toast";
import {ApiClient} from "service";
import {isEmpty} from "lodash";
import {updateShipping, updateUser, clearCartCount} from "../../store/actions";
import Constants from "../../service/Config";
import analytics from "@react-native-firebase/analytics";

const {width} = Dimensions.get("window");

const labels = ["Billing\nAddress", "Shipping\nAddress", "Review"];
const customStyles = {
  stepIndicatorSize: 26,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#fe7013",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#fe7013",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#fe7013",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#fe7013",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 12,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#fe7013",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 10,
  currentStepLabelColor: "#fe7013",
  labelFontFamily: "Inter-Regular",
};

function CheckoutScreen({navigation}) {
  console.log(navigation.state.params);
  const [stepPos, setStepPos] = useState(0);
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [gst, setGst] = useState("");

  const {accent_color, primary_color, pincode_active} = useSelector(state => state.appSettings);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [orderdata, SetorderData] = useState("");
  const [loading, setloading] = useState(false);

  useEffect(() => {
    trackScreenView("Checkout Screen");
  }, []);

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  const ApiCall = (postcode, pos) => {
    let param = {
      pincode: postcode,
    };
    let URL = Constants.baseURL + Constants.path;
    console.log(param);
    ApiClient.post(URL + "/checkpincode/", param)
      .then(({data}) => {
        console.log(data);
        if (data.delivery) {
          setStepPos(pos);
        } else {
          Toast.show("Delivery is not available for your location");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onChangeShipToDifferent = useCallback(() => {
    setShipToDifferent(prevState => !prevState);
    if (shipToDifferent) {
      const {billing} = user;
      dispatch(
        updateShipping({
          ...user.shipping,
          first_name: billing.first_name,
          country: billing.country,
          state: billing.state,
          city: billing.city,
          postcode: billing.postcode,
          address_1: billing.address_1,
        }),
      );
    }
  });

  const orderData = text => {
    console.log(text);
    SetorderData(text);
  };

  const goBack = () => {
    if (shipToDifferent) {
      setStepPos(0);
    } else if (stepPos == 2) {
      setStepPos(0);
    } else if (stepPos == 3) {
      setStepPos(2);
    } else {
      navigation.goBack(null);
    }
  };

  const getGst = text => {
    console.log(text);
    setGst(text);
  };

  const gotoShipping = () => {
    console.log(stepPos);
    if (stepPos == 3) {
      if (orderdata.chosen_gateway == "") {
        Toast.show("Please select the payment method");
      } else {
        let data = {};
        if (pincode_active) {
          for (let item of orderdata.product) {
            if (item.delivery) data[item.product_id] = item.delivery_date;
          }
        }
        console.log("order" + orderdata.chosen_gateway);
        let u = user && user.id ? "?user_id=" + user.id : "?user_id=";
        let p = "&payment_method=" + orderdata.chosen_gateway;
        let c = "&shipping_method=" + orderdata.chosen_shipping_method;
        //let pw = pay_via_wallet ? "&pay_via_wallet=" + pay_via_wallet : "";
        console.log(u);
        console.log(p);
        console.log(c);
        console.log(data);
        setloading(true);
        ApiClient.post("/checkout/new-order" + u + p + c, data)
          .then(resp => {
            setloading(false);
            console.log(resp);
            dispatch(clearCartCount());
            ApiClient.get("/cart/clear")
              .then(res => {})
              .catch(error => {
                console.log(error);
              });
            if (resp.status == 200) {
              navigation.navigate("PaymentPage", {Orderdata: resp.data});
            } else {
            }
          })
          .catch(errr => {
            setloading(false);
          });
      }
    } else if (stepPos == 2 || shipToDifferent) {
      const {billing, shipping} = user;
      if (
        isEmpty(billing.first_name) ||
        isEmpty(billing.email) ||
        isEmpty(billing.phone) ||
        isEmpty(billing.country) ||
        isEmpty(billing.state) ||
        isEmpty(billing.city) ||
        isEmpty(billing.postcode) ||
        isEmpty(billing.address_1)
      ) {
        Toast.show("Please enter the required filled");
      } else if (billing.phone.length != 10) {
        Toast.show("Please enter the valid phone number.");
      } else if (
        stepPos == 2 &&
        (isEmpty(shipping.first_name) ||
          isEmpty(shipping.country) ||
          isEmpty(shipping.state) ||
          isEmpty(shipping.city) ||
          isEmpty(shipping.postcode) ||
          isEmpty(shipping.address_1))
      ) {
        Toast.show("Please enter the required filled");
      } else if (pincode_active) {
        ApiCall(user.shipping.postcode, 3);
        if (shipToDifferent) {
          let data = {
            user_id: user.id,
            shipping_first_name: billing.first_name,
            shipping_last_name: billing.last_name,
            shipping_email: billing.email,
            shipping_phone: billing.phone,
            shipping_company: billing.company,
            shipping_address_1: billing.address_1,
            shipping_address_2: billing.address_2,
            shipping_city: billing.city,
            shipping_state: billing.state,
            shipping_postcode: billing.postcode,
            shipping_country: billing.country,
            billing_first_name: billing.first_name,
            billing_last_name: billing.last_name,
            billing_email: billing.email,
            billing_phone: billing.phone,
            billing_company: billing.company,
            billing_address_1: billing.address_1,
            billing_address_2: billing.address_2,
            billing_city: billing.city,
            billing_state: billing.state,
            billing_postcode: billing.postcode,
            billing_country: billing.country,
            billing_gst_number: gst,
            checkbox: 0,
          };

          setloading(true);
          console.log("Update billing shipping c");
          ApiClient.post("/checkout/update-billing", data)
            .then(res => {
              setloading(false);
              console.log(res);
              if (res.status == 200) {
                //console.log(res);
                dispatch(updateUser(res.data.details));
                // dispatch(updateBilling(billingParam));
                //dispatch(updateShipping(shippingParam));
              } else {
                Toast.show("Nothing to update", Toast.LONG);
              }
            })
            .catch(error => {
              setloading(false);
            });
        } else {
          console.log("shipping");
          let param = {
            user_id: user.id,
            shipping_first_name: shipping.first_name,
            shipping_last_name: shipping.last_name,
            shipping_email: "",
            shipping_phone: "",
            shipping_company: shipping.company,
            shipping_address_1: shipping.address_1,
            shipping_address_2: shipping.address_2,
            shipping_city: shipping.city,
            shipping_state: shipping.state,
            shipping_postcode: shipping.postcode,
            shipping_country: shipping.country,
            billing_first_name: billing.first_name,
            billing_last_name: billing.last_name,
            billing_email: billing.email,
            billing_phone: billing.phone,
            billing_company: billing.company,
            billing_address_1: billing.address_1,
            billing_address_2: billing.address_2,
            billing_city: billing.city,
            billing_state: billing.state,
            billing_postcode: billing.postcode,
            billing_country: billing.country,
            billing_gst_number: gst,
            checkbox: 0,
          };
          // console.log(param);

          setloading(true);
          console.log("Update billing che");
          ApiClient.post("/checkout/update-billing", param)
            .then(res => {
              setloading(false);
              console.log(res);
              if (res.status == 200) {
                dispatch(updateUser(res.data.details));
                //dispatch(updateShipping(param));
              } else {
                Toast.show("Nothing to update", Toast.LONG);
              }
            })
            .catch(error => {
              setloading(false);
            });
        }
      } else {
        // console.log("hey...");
        if (shipToDifferent) {
          let data = {
            user_id: user.id,
            shipping_first_name: billing.first_name,
            shipping_last_name: billing.last_name,
            shipping_email: billing.email,
            shipping_phone: billing.phone,
            shipping_company: billing.company,
            shipping_address_1: billing.address_1,
            shipping_address_2: billing.address_2,
            shipping_city: billing.city,
            shipping_state: billing.state,
            shipping_postcode: billing.postcode,
            shipping_country: billing.country,
            billing_first_name: billing.first_name,
            billing_last_name: billing.last_name,
            billing_email: billing.email,
            billing_phone: billing.phone,
            billing_company: billing.company,
            billing_address_1: billing.address_1,
            billing_address_2: billing.address_2,
            billing_city: billing.city,
            billing_state: billing.state,
            billing_postcode: billing.postcode,
            billing_country: billing.country,
            billing_gst_number: gst,
            checkbox: 0,
          };

          setloading(true);
          console.log("Update billing shipping");
          ApiClient.post("/checkout/update-billing", data)
            .then(res => {
              setloading(false);
              console.log(res);
              if (res.status == 200) {
                dispatch(updateUser(res.data.details));
                // dispatch(updateBilling(billingParam));
                // dispatch(updateShipping(shippingParam));
              } else {
                Toast.show("Nothing to update", Toast.LONG);
              }
            })
            .catch(error => {
              setloading(false);
            });
        } else {
          let param = {
            user_id: user.id,
            shipping_first_name: shipping.first_name,
            shipping_last_name: shipping.last_name,
            shipping_email: shipping.email,
            shipping_phone: shipping.phone,
            shipping_company: shipping.company,
            shipping_address_1: shipping.address_1,
            shipping_address_2: shipping.address_2,
            shipping_city: shipping.city,
            shipping_state: shipping.state,
            shipping_postcode: shipping.postcode,
            shipping_country: shipping.country,
            billing_first_name: billing.first_name,
            billing_last_name: billing.last_name,
            billing_company: billing.company,
            billing_email: billing.email,
            billing_phone: billing.phone,
            billing_address_1: billing.address_1,
            billing_address_2: billing.address_2,
            billing_city: billing.city,
            billing_state: billing.state,
            billing_postcode: billing.postcode,
            billing_country: billing.country,
            billing_gst_number: gst,
            checkbox: 0,
          };
          //console.log(param);

          setloading(true);
          console.log("Update billing");
          ApiClient.post("/checkout/update-billing", param)
            .then(res => {
              setloading(false);
              console.log(res);
              if (res.status == 200) {
                dispatch(updateUser(res.data.details));
                //dispatch(updateShipping(param));
              } else {
                Toast.show("Nothing to update", Toast.LONG);
              }
            })
            .catch(error => {
              setloading(false);
            });
        }
        setStepPos(3);
      }
    } else if (stepPos == 0) {
      const {billing} = user;
      if (
        isEmpty(billing.first_name) ||
        isEmpty(billing.email) ||
        isEmpty(billing.phone) ||
        isEmpty(billing.country) ||
        isEmpty(billing.state) ||
        isEmpty(billing.city) ||
        isEmpty(billing.postcode) ||
        isEmpty(billing.address_1)
      ) {
        Toast.show("Please enter the required filled");
      } else if (billing.phone.length != 10) {
        Toast.show("Please enter the valid phone number.");
      } else if (pincode_active) {
        ApiCall(user.billing.postcode, 2);
        const {billing, shipping} = user;
        let param = {
          user_id: user.id,
          billing_first_name: billing.first_name,
          billing_last_name: billing.last_name,
          billing_company: billing.company,
          billing_email: billing.email,
          billing_phone: billing.phone,
          billing_address_1: billing.address_1,
          billing_address_2: billing.address_2,
          billing_city: billing.city,
          billing_state: billing.state,
          billing_postcode: billing.postcode,
          billing_country: billing.country,
          billing_gst_number: gst,
          checkbox: 1,
        };
        //console.log(param);

        setloading(true);
        console.log("Update billing check");
        ApiClient.post("/checkout/update-billing", param)
          .then(res => {
            setloading(false);
            console.log(res);
            if (res.status == 200) {
              dispatch(updateUser(res.data.details));
              //dispatch(updateShipping(param));
            } else {
              Toast.show("Nothing to update", Toast.LONG);
            }
          })
          .catch(error => {
            setloading(false);
          });
      } else {
        console.log("last");
        const {billing, shipping} = user;
        let param = {
          user_id: user.id,
          billing_first_name: billing.first_name,
          billing_last_name: billing.last_name,
          billing_company: billing.company,
          billing_email: billing.email,
          billing_phone: billing.phone,
          billing_address_1: billing.address_1,
          billing_address_2: billing.address_2,
          billing_city: billing.city,
          billing_state: billing.state,
          billing_postcode: billing.postcode,
          billing_country: billing.country,
          billing_gst_number: gst,
          checkbox: 1,
        };
        console.log(param);

        setloading(true);
        //console.log("Update billing");
        ApiClient.post("/checkout/update-billing", param)
          .then(res => {
            setloading(false);
            console.log(res);
            if (res.status == 200) {
              dispatch(updateUser(res.data.details));
              //dispatch(updateShipping(param));
            } else {
              Toast.show("Nothing to update", Toast.LONG);
            }
          })
          .catch(error => {
            setloading(false);
          });
        setStepPos(2);
      }
    }
  };

  const renderStepIndicator = params => (
    <Icon type="MaterialIcons" {...getStepIndicatorIconConfig(params)} />
  );

  const getStepIndicatorIconConfig = ({position, stepStatus}) => {
    const iconConfig = {
      name: "feed",
      color: stepStatus === "finished" ? "#ffffff" : "#fe7013",
      size: 15,
    };
    switch (position) {
      case 0: {
        iconConfig.name = "event-note";
        break;
      }
      case 1: {
        iconConfig.name = "account-balance";
        break;
      }
      case 2: {
        iconConfig.name = "rate-review";
        break;
      }
      default: {
        break;
      }
    }
    return iconConfig;
  };

  return (
    <Container>
      <Toolbar title="Checkout" backButton />
      <View style={{marginTop: 8}} />
      <StepIndicator
        renderStepIndicator={renderStepIndicator}
        customStyles={customStyles}
        currentPosition={stepPos}
        labels={labels}
        stepCount={3}
      />

      <SwiperFlatList>
        {stepPos == 0 && (
          <View style={{paddingVertical: 16, width}}>
            <BillingAddress getGst={getGst} />
          </View>
        )}

        {stepPos == 2 && (
          <View style={{paddingVertical: 16, width}}>
            <ShippingAddress />
          </View>
        )}

        {stepPos == 3 && (
          <View style={{paddingVertical: 16, width}}>
            <Review cartData={navigation.state.params.cartData} orderData={orderData} />
          </View>
        )}
      </SwiperFlatList>

      <View style={styles.footer}>
        {stepPos == 0 && (
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              padding: 16,
              alignItems: "center",
            }}>
            <Text style={{fontWeight: "500"}}>Same For Shipping</Text>
            <Switch value={shipToDifferent} onChange={onChangeShipToDifferent} />
          </View>
        )}
        <View style={{flexDirection: "row", width: "100%"}}>
          {stepPos != 0 && (
            <Button
              style={[styles.footerButton, {marginEnd: -10, backgroundColor: accent_color}]}
              onPress={goBack}>
              <Text style={{color: "white", marginEnd: 5, fontWeight: "600"}}>PREVIOUS</Text>
            </Button>
          )}
          <Button
            style={[styles.footerButton, {backgroundColor: accent_color}]}
            onPress={gotoShipping}>
            <Text style={{color: "white", marginEnd: 5, fontWeight: "600"}}>
              {stepPos == 3 ? "PLACE ORDER" : "NEXT"}
            </Text>
          </Button>
        </View>
      </View>
      {loading && <ActivityIndicator />}
    </Container>
  );
}

CheckoutScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    borderTopColor: "#dedede",
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
    height: 40,
    // margin: 5,
    //borderTopStartRadius: 8,
    //borderTopEndRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(CheckoutScreen);
