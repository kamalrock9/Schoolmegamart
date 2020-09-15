import React, {useEffect, useState} from "react";
import {View, Dimensions, Image, SafeAreaView, BackHandler, Alert} from "react-native";
import Shimmer from "react-native-shimmer";
import {TabView, SceneMap, TabBar} from "react-native-tab-view";
import {useSelector, useDispatch} from "react-redux";
import {Text} from "components";

//Tabs
import HomeScreen from "./home/HomeScreen";
import CategoryScreen from "./CategoryScreen";
import Order from "./Order/Orders";
import AccountSetting from "./AccountSetting";

const initialLayout = {width: Dimensions.get("window").width};

const defaultRoutes = [
  {
    key: "home",
    title: "Home",
    image: require("../assets/imgs/homeBottom.png"),
  },
  {
    key: "category",
    title: "Category",
    image: require("../assets/imgs/categoryBottom.png"),
  },
  {
    key: "order",
    title: "Order",
    image: require("../assets/imgs/orderBottom.png"),
  },
  {
    key: "user",
    title: "User",
    image: require("../assets/imgs/userBottom.png"),
  },
];

function Tabs({navigation}) {
  const dispatch = useDispatch();

  const [index, setIndex] = useState(0);
  const user = useSelector(state => state.user);
  const [routes, setRoutes] = useState(defaultRoutes);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit App?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {text: "YES", onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    // const onOpened = openResult => {
    //   // console.log("Message: ", openResult.notification.payload);
    //   // console.log("Data: ", openResult.notification.payload.additionalData);
    //   // console.log("isActive: ", openResult.notification.isAppInFocus);

    //   if (!openResult.notification.payload.additionalData) return;

    //   const { type, payload } = openResult.notification.payload.additionalData;
    //   switch (type) {

    //     case "home":
    //       navigation.navigate("HomeScreen");
    //       break;

    //     case "category":
    //       navigation.navigate("CategoryScreen");
    //       break;

    //     case "order":
    //       navigation.navigate("Order");
    //       break;

    //     case "user":
    //       navigation.navigate("AccountSetting");
    //       break;
    //   }
    // };

    const unsubscribeSiFocus = navigation.addListener("willFocus", e => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    });
    const unsubscribeSiBlur = navigation.addListener("willBlur", e => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    });
    BackHandler.addEventListener("hardwareBackPress", backAction);
    // OneSignal.addEventListener("opened", onOpened);
    return () => {
      unsubscribeSiFocus.remove();
      unsubscribeSiBlur.remove();
      BackHandler.removeEventListener("hardwareBackPress", backAction);
      // OneSignal.removeEventListener("opened", onOpened);
    };
  }, []);

  return (
    <>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        tabBarPosition="bottom"
        lazy={true}
      />
      <SafeAreaView style={{flex: 0}} />
    </>
  );
}

const renderScene = SceneMap({
  home: HomeScreen,
  category: CategoryScreen,
  order: Order,
  user: AccountSetting,
});

const renderTabBar = props => (
  <View>
    {/* <Image
      source={require("../assets/imgs/homeBottom.png")}
      style={{height: 20, width: "100%", position: "absolute", top: -20}}
    /> */}
    <TabBar
      {...props}
      renderIndicator={() => <View />}
      onTabLongPress={({route}) => props.jumpTo(route.key)}
      activeColor="#fd3462"
      inactiveColor="#999999"
      style={{backgroundColor: "#FFFFFF"}}
      tabStyle={{paddingHorizontal: 4, paddingVertical: 5}}
      renderLabel={renderLabel}
      renderIcon={renderIcon}
      lazy={true}
    />
  </View>
);

const renderLabel = ({route, focused, color}) => {
  if (route.key == "subscription") {
    return (
      <Shimmer>
        <Text style={{color, fontSize: 10, fontWeight: "700"}} numberOfLines={1}>
          {route.title}
        </Text>
      </Shimmer>
    );
  } else {
    return (
      <Text style={{color, fontSize: 10, fontWeight: "600"}} numberOfLines={1}>
        {route.title}
      </Text>
    );
  }
};

const renderIcon = ({route, focused, color}) => (
  <Image
    style={[
      {width: 25, height: 25, marginVertical: 0},
      route.key !== "contest" ? {tintColor: color} : null,
    ]}
    source={route.image}
  />
);

export default Tabs;
