import React from "react";
import { Keyboard } from "react-native";
import { debounce } from "lodash";

export default withPreventDoubleClick = WrappedComponent => {
  class PreventDoubleClick extends React.PureComponent {
    debouncedOnPress = () => {
      Keyboard.dismiss();
      this.props.onPress && this.props.onPress();
    };

    onPress = debounce(this.debouncedOnPress, 300, { leading: true, trailing: false });

    render() {
      return <WrappedComponent {...this.props} onPress={this.onPress} />;
    }
  }

  PreventDoubleClick.displayName = `withPreventDoubleClick(${WrappedComponent.displayName ||
    WrappedComponent.name})`;
  return PreventDoubleClick;
};
