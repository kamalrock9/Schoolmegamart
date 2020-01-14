import React from "react";
import { View, TouchableNativeFeedback } from "react-native";
import withPreventDoubleClick from "./withPreventDoubleClick";

class Button extends React.PureComponent {
  render() {
    return (
      <TouchableNativeFeedback {...this.props}>
        <View {...this.props}>{this.props.children}</View>
      </TouchableNativeFeedback>
    );
  }
}
export default withPreventDoubleClick(Button);
