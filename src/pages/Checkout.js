import React from "react";
import {View} from "react-native";
import {Text} from "components";
import MultiStep from "react-multistep";
import BillingAddress from "./BillingAddress";
import ShippingAddress from "./ShippingAddress";
import Review from "./Review";

function Checkout() {
  const steps = [
    {name: "Billing Adress", component: <BillingAddress />},
    {name: "Shipping Address", component: <ShippingAddress />},
    {name: "Review", component: <Review />},
  ];

  return (
    <View>
      <Text>Checkout Page</Text>
      {/* <MultiStep showNavigation={true} steps={steps} /> */}
    </View>
  );
}

export default Checkout;
