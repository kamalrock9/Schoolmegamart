import React, {useEffect, useState} from "react";
//React-Navigation
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import {createBottomTabNavigator, createMaterialTopTabNavigator} from "react-navigation-tabs";
import {createDrawerNavigator} from "react-navigation-drawer";
import Toast, {BaseToast} from "react-native-toast-message";
import {StyleSheet} from "react-native";

//SIDEMENU
import Drawer from "./src/pages/drawer/Drawer";
import TawkToChat from "./src/pages/drawer/TawkToChat";
import Notification from "./src/pages/drawer/Notification/Notification";

//pages
import HomeScreen from "./src/pages/home/HomeScreen";
import CategoryScreen from "./src/pages/CategoryScreen";
import SplashScreen from "./src/pages/SplashScreen";
import ProductScreen from "./src/pages/product/ProductScreen";
import ProductDetailScreen from "./src/pages/product/ProductDetailScreen";
import SliderImageZoom from "./src/pages/product/SliderImageZoom";
import Cart from "./src/pages/Cart/Cart";
import WishlistScreen from "./src/pages/WishlistScreen";
import TermAndCondition from "./src/pages/TermAndCondition";
import Orders from "./src/pages/Order/Orders";
import OrderDetails from "./src/pages/Order/OrderDetails";
import AccountSetting from "./src/pages/AccountSetting";
import ManageAddress from "./src/pages/manageAddress/ManageAddress";
import BillingAddress from "./src/pages/manageAddress/BillingAddress";
import ShippingAddress from "./src/pages/manageAddress/ShippingAddress";
import Download from "./src/pages/Download";
import Wallet from "./src/pages/wallet/Wallet";
import ReferAndEarn from "./src/pages/wallet/ReferAndEarn";
import CheckoutScreen from "./src/pages/checkout/CheckoutScreen";
import Review from "./src/pages/Review";
import Search from "./src/pages/Search";
import PaymentPage from "./src/pages/checkout/PaymentPage";
import Auth from "./src/pages/auth/Login";
import Reviews from "./src/pages/product/Reviews";
import AddReview from "./src/pages/product/AddReview";
import Tabs from "./src/pages/Tabs";
import ForgetPassword from "./src/pages/auth/ForgetPassword";
import PostRegisterOTPVerify from "./src/pages/auth/PostRegisterOTPVerify";
import PostRegisterOTP from "./src/pages/auth/PostRegisterOtp";
import CouponList from "./src/pages/CouponList";
import TrackYourOrder from "./src/pages/Order/TrackYourOrder";
import ForgetPasswordOTPVerify from "./src/pages/auth/ForgetPasswordOTPVerify";
import NewPassword from "./src/pages/auth/NewPassword";
//Redux
import {persistor, store} from "./src/store";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/lib/integration/react";
//component
import Icon from "./src/components/IconNB";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
      <Toast ref={ref => Toast.setRef(ref)} />
    </>
  );
}

const HomeStack = createStackNavigator(
  {
    HomeScreen,
    ProductScreen,
    ProductDetailScreen,
    SliderImageZoom,
    Cart,
    CheckoutScreen,
    BillingAddress,
    ShippingAddress,
    Review,
    WishlistScreen,
    Search,
    PaymentPage,
    Auth,
    Reviews,
    AddReview,
    CategoryScreen,
    ForgetPassword,
    PostRegisterOTP,
    PostRegisterOTPVerify,
    ForgetPasswordOTPVerify,
    NewPassword,
    CouponList,
    TrackYourOrder,
    AccountSetting,
    Download,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const CategoryStack = createStackNavigator(
  {
    CategoryScreen,
    Cart,
    CheckoutScreen,
    WishlistScreen,
    Search,
    Auth,
    ForgetPassword,
    PostRegisterOTP,
    PostRegisterOTPVerify,
    ForgetPasswordOTPVerify,
    NewPassword,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const ProductStack = createStackNavigator(
  {
    ProductScreen,
    ProductDetailScreen,
    CategoryScreen,
    CheckoutScreen,
    Cart,
    WishlistScreen,
    Search,
    Auth,
    Reviews,
    AddReview,
    ForgetPassword,
    PostRegisterOTP,
    PostRegisterOTPVerify,
    ForgetPasswordOTPVerify,
    NewPassword,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const OrderStack = createStackNavigator({
  Orders,
  OrderDetails,
});

const AccountSett = createStackNavigator(
  {
    AccountSetting,
    HomeScreen,
    Auth,
  },
  {
    initialRouteName: "AccountSetting",
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const CartStack = createStackNavigator(
  {
    Cart,
  },
  {
    initialRouteName: "Cart",
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const WalletStack = createStackNavigator(
  {
    Wallet,
    ReferAndEarn,
  },
  {
    initialRouteName: "Wallet",
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const TabNavigator = createBottomTabNavigator(
  {
    HomeStack: {
      screen: HomeStack,
      navigationOptions: ({navigation}) => {
        let {routeName} = navigation.state.routes[navigation.state.index];
        return {
          title: "Home",
          tabBarVisible: routeName === "HomeScreen" ? true : false,
          tabBarIcon: ({tintColor}) => (
            <Icon
              style={styles.icon}
              size={20}
              type="SimpleLineIcons"
              name="home"
              color={tintColor}
            />
          ),
        };
      },
    },
    CategoryStack: {
      screen: CategoryStack,
      navigationOptions: {
        title: "Category",
        tabBarIcon: ({tintColor}) => (
          <Icon
            style={styles.icon}
            size={22}
            type="MaterialCommunityIcons"
            name="content-duplicate"
            color={tintColor}
          />
        ),
      },
      tabBarOptions: {
        tabStyle: {
          paddingVertical: 10,
        },
      },
    },
    OrderStack: {
      screen: OrderStack,
      navigationOptions: {
        title: "Order",
        tabBarIcon: ({tintColor}) => (
          <Icon
            style={styles.icon}
            size={26}
            type="SimpleLineIcons"
            name="list"
            color={tintColor}
          />
          // <Image
          //   source={require("../schoolmegamart/src/assets/imgs/cart.png")}
          //   tintColor={tintColor}
          // />
        ),
      },
    },
    AccountSetting: {
      screen: CartStack,
      navigationOptions: {
        title: "Cart",
        tabBarIcon: ({tintColor}) => (
          <Icon style={styles.icon} name="cart" type="EvilIcons" size={32} color={tintColor} />
          // <Icon size={24} type="AntDesign" name="user" color={tintColor} />
          // <Image
          //   source={require("../schoolmegamart/src/assets/imgs/bottomProfile.png")}
          //   tintColor={tintColor}
          // />
        ),
      },
    },
  },
  {
    initialRouteName: "HomeStack",
    defaultNavigationOptions: {
      tabBarOptions: {
        activeTintColor: "#f28529",
        inactiveTintColor: "#8e9ca8",
        tabStyle: {
          paddingVertical: 4,
        },
      },
    },
  },
);

const DrawerNavigator = createDrawerNavigator(
  {
    TabNavigator,
    HomeStack,
    ProductStack,
    CategoryStack,
    OrderStack,
    AccountSett,
    TawkToChat,
    TermAndCondition,
    AccountSetting,
    ManageAddress,
    BillingAddress,
    ShippingAddress,
    WalletStack,
    Notification,
    Review,
    CartStack,
  },
  {
    initialRouteName: "TabNavigator",
    contentComponent: Drawer,
    drawerPosition: "right",
    drawerBackgroundColor: "transparent",
  },
);

const AppNavigator = createSwitchNavigator(
  {
    SplashScreen: SplashScreen,
    Drawer: DrawerNavigator,
  },
  {
    initialRouteName: "SplashScreen",
    backBehavior: "none",
  },
);

const styles = StyleSheet.create({
  icon: {marginTop: 4},
});

const AppContainer = createAppContainer(AppNavigator);

export default App;
