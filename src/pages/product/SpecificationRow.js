import React from "react";
import {View, StyleSheet} from "react-native";
import {Text} from "components";

function SpecificationRow({leftContent, rightContent}) {
  return (
    <View style={styles.container}>
      <Text style={{flex: 1}}>{leftContent}</Text>
      <Text style={{flex: 2}}>{rightContent}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    minHeight: 28,
  },
});

export default SpecificationRow;
