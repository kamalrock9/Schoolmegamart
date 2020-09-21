import React from "react";
import PropTypes from "prop-types";
import {TouchableOpacity} from "react-native";
import Icon from "./IconNB";
import Text from "./Text";
import {connect} from "react-redux";

class CheckBox extends React.PureComponent {
  render() {
    const {checked, label, style, styleView, styleIcon, appSettings} = this.props;
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          flexDirection: "row",
          padding: 16,
          alignItems: "center",
          width: "100%",
          ...styleView,
        }}>
        <Icon
          type="MaterialCommunityIcons"
          color={checked ? appSettings.accent_color : "#000000"}
          size={styleIcon ? 24 : 30}
          name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
        />

        <Text style={{marginStart: 16, flex: 1, ...style}}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  appSettings: state.appSettings,
});

CheckBox.propTypes = {
  ...TouchableOpacity.propTypes,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  checked: PropTypes.bool,
  onPress: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CheckBox.defaultProps = {
  checked: false,
  onPress: () => {},
  label: "",
};

export default connect(mapStateToProps)(CheckBox);
