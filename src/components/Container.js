import React from "react";
import {SafeAreaView} from "react-native";
import {useSelector} from "react-redux";

function Container({children}) {
  const {primary_color_dark} = useSelector(state => state.appSettings);

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: primary_color_dark}} />
      <SafeAreaView style={{flex: 1}}>{children}</SafeAreaView>
    </>
  );
}

export default Container;
