import React from "react";
import {View, StyleSheet, ActivityIndicator} from "react-native";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

function ProgressDialog({loading}) {
  const {accent_color} = useSelector(state => state.appSettings);
  return loading ? (
    <View style={styles.container}>
      <ActivityIndicator color={accent_color} size="large" />
    </View>
  ) : null;
}

ProgressDialog.propsTypes = {
  loading: PropTypes.bool.isRequired,
};

ProgressDialog.defaultProps = {
  loading: false,
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#00000077",
  },
});

export default React.memo(ProgressDialog);
