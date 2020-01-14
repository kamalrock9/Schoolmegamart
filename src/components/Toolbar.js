import React, {Component} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import Text from './Text';
import Button from './Button';
import Icon from './IconNB';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';

class Toolbar extends Component {
  _goTo = route => () => {
    this.props.navigation.navigate(route);
  };

  _goBack = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    const {
      appSettings,
      menuButton,
      backButton,
      wishListButton,
      cartButton,
      count,
      navigation: {state},
    } = this.props;
    return (
      <>
        <StatusBar
          backgroundColor={appSettings.primary_color_dark}
          barStyle="light-content"
        />
        <View
          style={[
            styles.container,
            {backgroundColor: appSettings.primary_color},
          ]}>
          {menuButton && (
            <Button
              onPress={this.props.navigation.openDrawer}
              style={styles.menuButton}>
              <Icon
                color={appSettings.primary_color_text}
                name="md-menu"
                size={24}
              />
            </Button>
          )}
          {backButton && (
            <Button onPress={this._goBack} style={styles.menuButton}>
              <Icon
                color={appSettings.primary_color_text}
                name="md-arrow-back"
                size={24}
              />
            </Button>
          )}
          <Text style={[styles.title, {color: appSettings.primary_color_text}]}>
            {this.props.title || state.routeName}
          </Text>

          <View style={styles.right}>
            {wishListButton && (
              <Button
                onPress={this._goTo('WishList')}
                style={styles.menuButton}>
                <Icon
                  color={appSettings.primary_color_text}
                  name="md-heart"
                  size={24}
                />
              </Button>
            )}
            {cartButton && (
              <Button onPress={this._goTo('Cart')} style={styles.menuButton}>
                <Icon
                  color={appSettings.primary_color_text}
                  name="md-cart"
                  size={24}
                />
                <Text
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        appSettings.toolbarbadgecolor ||
                        appSettings.accent_color,
                    },
                  ]}>
                  <Text style={{color: 'white', fontWeight: '700'}}>
                    {count}
                  </Text>
                </Text>
              </Button>
            )}
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    appSettings: state.appSettings,
    count: state.cartCount,
  };
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  badge: {
    position: 'absolute',
    end: -4,
    top: -4,
    transform: [{scale: 0.7}],
    width: 25,
    height: 25,
    borderRadius: 15,
    fontSize: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    paddingHorizontal: 16,
  },
  right: {
    flexDirection: 'row',
    marginStart: 'auto',
  },
  menuButton: {padding: 16},
});

export default connect(mapStateToProps)(withNavigation(Toolbar));
