import React from "react";
import { TouchableOpacity } from "react-native";
import withPreventDoubleClick from "./withPreventDoubleClick";

class Button extends React.PureComponent {
  render() {
    return <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>;
  }
}
export default withPreventDoubleClick(Button);
