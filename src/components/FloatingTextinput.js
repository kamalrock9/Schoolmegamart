import React, {Component} from "react";
import PropTypes from "prop-types";
import {View, StatusBar, TextInput, StyleSheet} from "react-native";
import {connect} from "react-redux";
import Animated, {Easing} from "react-native-reanimated";

class FloatingTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    };
    this._animatedIsFocused = new Animated.Value(props.value === "" ? 0 : 1);
  }

  handleFocus = () => this.setState({isFocused: true});
  handleBlur = () => this.setState({isFocused: false});

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== "" ? 1 : 0,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : null;
  }

  render() {
    const {label, containerStyle, style, appSettings} = this.props;

    let labalColor = this.props.labelColor
      ? Animated.color(...this.hexToRgb(this.props.labelColor))
      : Animated.color(210, 210, 210);

    let flotinglabelColor = appSettings.accent_color
      ? Animated.color(...this.hexToRgb(appSettings.accent_color))
      : Animated.color(210, 210, 210);

    const labelStyle = {
      position: "absolute",
      fontFamily: "Muli-Regular",
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [27, 8],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 11],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [labalColor, flotinglabelColor],
      }),
    };
    return (
      <View style={[{paddingTop: 18}, containerStyle]}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          {...this.props}
          style={[styles.txtInput, style]}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  appSettings: state.appSettings,
});
export default connect(mapStateToProps)(FloatingTextInput);

const styles = StyleSheet.create({
  txtInput: {
    height: 35,
    fontSize: 14,
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#EDEBF2",
    width: "100%",
  },
});

FloatingTextInput.propTypes = {
  ...TextInput.propTypes,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
};
FloatingTextInput.defaultProps = {
  containerStyle: {},
  label: "Placeholder",
  hideLabel: false,
};
