import React from "react";
import PropTypes from "prop-types";
import {TouchableOpacity} from "react-native";
import Icon from "./IconNB";
import Text from "./Text";
import {connect} from "react-redux";
import HTMLRender from "./HTMLRender";
import StarRating from "react-native-star-rating";

class CheckBoxHTML extends React.PureComponent {
  render() {
    const {checked, label, count, style, styleView, styleIcon, appSettings} = this.props;
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
        <StarRating
          disabled
          maxStars={5}
          rating={label}
          containerStyle={{marginStart: 8, marginTop: 4, marginVertical: 4}}
          starStyle={{marginEnd: 5}}
          starSize={14}
          halfStarEnabled
          emptyStarColor={appSettings.accent_color}
          fullStarColor={appSettings.accent_color}
          halfStarColor={appSettings.accent_color}
        />
        <Text>{"(" + Number(count) + ")"}</Text>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  appSettings: state.appSettings,
});

CheckBoxHTML.propTypes = {
  ...TouchableOpacity.propTypes,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  checked: PropTypes.bool,
  onPress: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CheckBoxHTML.defaultProps = {
  checked: false,
  onPress: () => {},
  label: "",
};

export default connect(mapStateToProps)(CheckBoxHTML);
