import React, { useState, useReducer } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Toolbar, Container } from "components";
import { useSelector } from "react-redux";
import BillingAddress from "../BillingAddress";
import ShippingAddress from "../ShippingAddress";
import Review from "../Review";
import StepIndicator from "react-native-step-indicator";
import { useTranslation } from "react-i18next"

const labels = ["Billing Address", "Shipping Address", "Order Summary", "Payment Method"];
const customStyles = {
  stepIndicatorSize: 24,
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
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#fe7013",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#fe7013",
  marginVertical: 10,
};

function CheckoutScreen() {
  const [stepPos, setStepPos] = useState(0);
  const appSettings = useReducer(state => state.appSettings);
  const { t } = useTranslation();
  const steps = [
    { name: t("BILLING") + t("ADDRESS"), component: <BillingAddress /> },
    { name: t("SHIPPING") + t("ADDRESS"), component: <ShippingAddress /> },
    { name: t("REVIEW") + t("ADDRESS"), component: <Review /> },
  ];

  return (
    <Container>
      <Toolbar title="Checkout" backButton />
      <StepIndicator
        customStyles={customStyles}
        currentPosition={stepPos}
        labels={labels}
        stepCount={4}
      />
      {/* <MultiStep showNavigation={true} steps={steps} /> */}
    </Container>
  );
}

CheckoutScreen.navigationOptions = {
  header: null,
};

export default CheckoutScreen;
