import React from "react";
import {View, StyleSheet} from "react-native";
import Text, {fonts, getFontFamily} from "./Text";
import HTML from "react-native-render-html";

const delRenderer = (htmlAttribs, children, convertedCSSStyles, passProps) => (
  <Text key={passProps.key} style={convertedCSSStyles}>
    {children} &nbsp;
  </Text>
);

function HTMLRender({fontSize, fontWeight, color, baseFontStyle, ...props}) {
  const resolvedStyle = {...StyleSheet.flatten(baseFontStyle)};
  resolvedStyle.fontFamily = resolvedStyle.fontFamily
    ? getFontFamily(resolvedStyle.fontFamily, resolvedStyle)
    : getFontFamily("Inter", resolvedStyle);
  delete resolvedStyle.fontStyle;
  delete resolvedStyle.fontWeight;
  return (
    <HTML
      {...props}
      baseFontStyle={resolvedStyle}
      tagsStyles={{
        del: styles.del,
        ins: styles.ins,
        p: {paddingVertical: 0},
        ul: {paddingLeft: 0},
        dl: {
          display: "flex",
          flexDirection: "row",
          textTransform: "capitalize",
          color: "#757575",
          margin: 0,
          flexWrap: "wrap",
        },
        dt: {
          paddingEnd: 5,
        },
        dd: {
          color: "#000",
          paddingHorizontal: 5,
          marginEnd: "auto",
          //borderEndWidth: 1,
          // flexGrow: 1,
          // borderEndColor: "#ccc",
        },
      }}
      renderers={{del: delRenderer}}
    />
  );
}

const styles = StyleSheet.create({
  del: {
    textDecorationLine: "line-through",
    color: "#999999",
    marginLeft: 20,
  },
  ins: {
    color: "#000000",
  },
});
export default HTMLRender;
