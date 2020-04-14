import React from "react";
import {SafeAreaView} from "react-native";
import {useSelector} from "react-redux";

function Container({children, style = {}}) {
  const {primary_color_dark} = useSelector(state => state.appSettings);

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: primary_color_dark || "#000"}} />
      <SafeAreaView style={{flex: 1, ...style}}>{children}</SafeAreaView>
    </>
  );
}

export default Container;
