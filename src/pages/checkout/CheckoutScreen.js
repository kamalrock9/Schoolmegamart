import React, {useState, useReducer, useCallback} from "react";
import {View, StyleSheet, Dimensions, Switch} from "react-native";
import {Text, Toolbar, Container, Button} from "components";
import {useSelector} from "react-redux";
import BillingAddress from "./BillingAddress";
import ShippingAddress from "./ShippingAddress";
import Review from "../Review";
import StepIndicator from "react-native-step-indicator";
import SwiperFlatList from "react-native-swiper-flatlist";

const {width} = Dimensions.get("window");

const labels = ["Billing\nAddress", "Shipping\nAddress", "Order\nSummary", "Payment\nMethod"];
const customStyles = {
  stepIndicatorSize: 20,
  currentStepIndicatorSize: 24,
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
  labelSize: 12,
  currentStepLabelColor: "#fe7013",
  labelFontFamily: "Inter-Regular",
};

function CheckoutScreen() {
  const [stepPos, setStepPos] = useState(2);
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const {accent_color} = useSelector(state => state.appSettings);

  const steps = [
    {name: t("BILLING") + t("ADDRESS"), component: <BillingAddress />},
    {name: t("SHIPPING") + t("ADDRESS"), component: <ShippingAddress />},
    {name: t("REVIEW") + t("ADDRESS"), component: <Review />},
  ];
  const onChangeShipToDifferent = useCallback(() => {
    setShipToDifferent(prevState => !prevState);
  });

  return (
    <Container>
      <Toolbar title="Checkout" backButton />
      <View style={{marginTop: 8}} />
      <StepIndicator
        customStyles={customStyles}
        currentPosition={stepPos}
        labels={labels}
        stepCount={4}
      />

      <SwiperFlatList>
        <View style={{paddingVertical: 16, width}}>
          <BillingAddress />
        </View>
      </SwiperFlatList>

      <View style={styles.footer}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            padding: 16,
            alignItems: "center",
          }}>
          <Text>Same For Shipping</Text>
          <Switch onChange={onChangeShipToDifferent} value={shipToDifferent} />
        </View>
        <View style={{flexDirection: "row", width: "100%"}}>
          <Button
            style={[styles.footerButton, {backgroundColor: accent_color}]}
            //onPress={gotoShipping}
          >
            <Text style={{color: "white", marginEnd: 5}}>NEXT</Text>
          </Button>
        </View>
      </View>
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
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(CheckoutScreen);
