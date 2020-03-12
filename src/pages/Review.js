import React from "react";
import {View} from "react-native";
import {Text, Toolbar} from "components";

function Review() {
  const billing = navigation.getParam("billing");
  console.log(billing);
  const item = navigation.getParam("item");
  console.log(item);
  return (
    <View>
      <Text>Review</Text>
    </View>
  );
}

Review.navigationOptions = {
  header: <Toolbar backButton title="Review" />,
};

export default Review;
