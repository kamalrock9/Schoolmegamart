import React, {useState} from "react";
import {View, StatusBar, StyleSheet, Platformjhhj} from "react-native";
import {Text, Icon, Button, Toolbar} from "components";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
function Filter({onBackPress}) {
  const {primary_color_dark, primary_color, primary_color_text} = useSelector(
    state => state.appSettings,
  );
  const {t} = useTranslation();

  const filterTabs = ["Price", "Categories", "Color", "Size"];

  const [index, setIndex] = useState(0);
  const [filterValues, setfiltervalues] = useState({
    stops: [],
    fareType: [],
    airlines: [],
    connectingLocations: [],
    price: [],
    departure: ["00:00 AM", "11:45 PM"],
    arrival: ["00:00 AM", "11:45 PM"],
    sortBy: "Fare low to high",
  });

  const onChangeIndex = index => () => {
    setIndex(index);
  };

  return (
    <View style={{flex: 1, margin: -21}}>
      <StatusBar backgroundColor={primary_color_dark} barStyle="light-content" />
      <View style={[styles.container, {backgroundColor: primary_color}]}>
        <Button onPress={onBackPress} style={styles.menuButton}>
          <Icon color={primary_color_text} type="Entypo" name="cross" size={24} />
        </Button>

        <Text style={[styles.title, {color: primary_color_text}]}>{t("FILTER")}</Text>
      </View>
      <View style={{flex: 1, flexDirection: "row"}}>
        <View style={{flex: 2, backgroundColor: "#E8EEF6"}}>
          {filterTabs.map((item, i) => (
            <Button
              style={[styles.filterTabs, {backgroundColor: i === index ? "#FFFFFF" : null}]}
              key={"filter_" + item + index}
              onPress={onChangeIndex(i)}>
              <Text>{item}</Text>
            </Button>
          ))}
        </View>
        <View style={{flex: 3, backgroundColor: "#FFFFFF"}}>
          {index == 0 && (
            <View
              style={{
                marginHorizontal: Platform.OS == "ios" ? 10 : 0,
                alignItems: "center",
                padding: 8,
              }}>
              <Text>price</Text>
            </View>
          )}
          {index == 1 && (
            <View
              style={{
                marginHorizontal: Platform.OS == "ios" ? 10 : 0,
                alignItems: "center",
                padding: 8,
              }}>
              <Text>categories</Text>
            </View>
          )}
          {index == 2 && (
            <View
              style={{
                marginHorizontal: Platform.OS == "ios" ? 10 : 0,
                alignItems: "center",
                padding: 8,
              }}>
              <Text>color</Text>
            </View>
          )}
          {index == 3 && (
            <View
              style={{
                marginHorizontal: Platform.OS == "ios" ? 10 : 0,
                alignItems: "center",
                padding: 8,
              }}>
              <Text>size</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    height: 56,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    paddingHorizontal: 16,
  },
  menuButton: {padding: 16},
  filterTabs: {
    width: "100%",
    padding: 16,
  },
});

export default Filter;
