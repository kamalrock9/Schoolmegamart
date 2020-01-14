import React from 'react';
//React-Navigation
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';

//SIDEMENU
import Drawer from './src/pages/drawer/Drawer';
import TawkToChat from './src/pages/drawer/TawkToChat';

//pages
import Home from './src/pages/home/Home';
import Category from './src/pages/Category';
import Splash from './src/pages/Splash';
import Products from './src/pages/Products';
import ProductDetails from './src/pages/ProductDetails/ProductDetails';
import Cart from './src/pages/Cart/Cart';
import WishList from './src/pages/WishList';

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
  Home,
  ProductDetails,
  Cart,
  WishList,
});

const CategoryStack = createStackNavigator({
  Category,
  ProductDetails,
  Cart,
  WishList,
});

const ProductStack = createStackNavigator({
  Products,
  ProductDetails,
  Cart,
  WishList,
});

const DrawerNavigator = createDrawerNavigator(
  {
    Home: HomeStack,
    Products: ProductStack,
    Category: CategoryStack,
    TawkToChat,
  },
  {
    contentComponent: Drawer,
  },
);

const AppNavigator = createSwitchNavigator(
  {
    Splash: Splash,
    Drawer: DrawerNavigator,
  },
  {
    initialRouteName: 'Splash',
    backBehavior: 'none',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default App;
