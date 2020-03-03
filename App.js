import React from 'react';
//React-Navigation
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';

//SIDEMENU
import Drawer from './src/pages/drawer/Drawer';
import TawkToChat from './src/pages/drawer/TawkToChat';

//pages
import HomeScreen from './src/pages/home/HomeScreen';
import CategoryScreen from './src/pages/CategoryScreen';
import SplashScreen from './src/pages/SplashScreen';
import ProductScreen from './src/pages/product/ProductScreen';
import ProductDetailScreen from './src/pages/product/ProductDetailScreen';
import Cart from './src/pages/Cart/Cart';
import WishlistScreen from './src/pages/WishlistScreen';
import TermAndCondition from './src/pages/TermAndCondition';

//Redux
import {persistor, store} from './src/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';

//I18nManager.forceRTL(false);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}

const HomeStack = createStackNavigator({
  HomeScreen,
  ProductDetailScreen,
  Cart,
  WishlistScreen,
});

const CategoryStack = createStackNavigator({
  CategoryScreen,
  Cart,
  WishlistScreen,
});

const ProductStack = createStackNavigator({
  ProductScreen,
  ProductDetailScreen,
  Cart,
  WishlistScreen,
});

const DrawerNavigator = createDrawerNavigator(
  {
    HomeStack,
    ProductStack,
    CategoryStack,
    TawkToChat,
    TermAndCondition,
  },
  {
    contentComponent: Drawer,
  },
);

const AppNavigator = createSwitchNavigator(
  {
    SplashScreen: SplashScreen,
    Drawer: DrawerNavigator,
  },
  {
    initialRouteName: 'SplashScreen',
    backBehavior: 'none',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default App;
