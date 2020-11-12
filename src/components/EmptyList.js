import React from "react";
import {View, StyleSheet, ActivityIndicator, Dimensions} from "react-native";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import Text from "./Text";
import Icon from "./IconNB";

const {height} = Dimensions.get("window");
function EmptyList({iconName, iconType, loading, label, enabled}) {
  const {accent_color} = useSelector(state => state.appSettings);

  return enabled ? (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color={accent_color} size="large" />
      ) : (
        <>
          <Icon style={[styles.icon, {color: accent_color}]} type={iconType} name={iconName} />
          <Text style={[styles.label, {color: accent_color}]}>{label}</Text>
        </>
      )}
    </View>
  ) : null;
}

EmptyList.propsTypes = {
  iconType: PropTypes.oneOf([
    "AntDesign",
    "Entypo",
    "EvilIcons",
    "Feather",
    "FontAwesome",
    "FontAwesome5",
    "Fontisto",
    "Foundation",
    "Ionicons",
    "MaterialCommunityIcons",
    "MaterialIcons",
    "Octicons",
    "SimpleLineIcons",
    "Zocial",
  ]),
  iconName: PropTypes.string,
  label: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
};

EmptyList.defaultProps = {
  iconType: "Octicons",
  iconName: "info",
  label: "No items found",
  loading: true,
  enabled: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 64,
    height: height - 168,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  label: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default React.memo(EmptyList);
