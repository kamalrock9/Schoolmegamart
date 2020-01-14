import React from "react";
import { NavigationActions } from "react-navigation";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button, Text } from "../../components";
import { Icon } from "native-base";
import { connect } from "react-redux";

class SideMenu extends React.PureComponent {
  navigateToScreen = (route, param = {}) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params: param
    });
    this.props.navigation.dispatch(navigateAction);
  };

  render() {
    const { appSettings } = this.props;

    return (
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            backgroundColor: "#dedede",
            justifyContent: "center",
            height: 150
          }}>
          <Icon
            name="account-circle"
            type="MaterialCommunityIcons"
            style={{ fontSize: 54 }}
          />
          <Text style={{ fontSize: 16 }}>Login | Register</Text>
        </View>
        <ScrollView>
          <Button style={styles.button} onPress={this.navigateToScreen("Home")}>
            <Icon name="home" type="FontAwesome" style={styles.icon} />
            <Text style={styles.text}>Home</Text>
          </Button>

          <Button
            style={styles.button}
            onPress={this.navigateToScreen("Products")}>
            <Icon name="shopping-bag" type="FontAwesome" style={styles.icon} />
            <Text style={styles.text}>Shop</Text>
          </Button>

          <Button
            style={styles.button}
            onPress={this.navigateToScreen("Category")}>
            <Icon name="archive" type="Entypo" style={styles.icon} />
            <Text style={styles.text}>Categories</Text>
          </Button>

          <View style={styles.divider} />
          {appSettings.hasOwnProperty("direct_tawk_id") &&
            appSettings.direct_tawk_id != "" && (
              <Button
                style={styles.button}
                onPress={this.navigateToScreen("TawkToChat", {
                  uri: appSettings.direct_tawk_id
                })}>
                <Icon name="home" type="FontAwesome" style={styles.icon} />
                <Text style={styles.text}>Chat support</Text>
              </Button>
            )}
        </ScrollView>
        <View
          style={{
            width: "100%",
            alignSelf: "flex-end",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingEnd: 16,
            paddingVertical: 8,
            borderTopWidth: 0.5,
            borderTopColor: "#dedede"
          }}>
          <Text>Version: 0.0.1</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  divider: {
    backgroundColor: "#dedede",
    height: 1
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48
  },
  icon: {
    color: "#777777",
    marginEnd: 16,
    marginStart: 12,
    fontSize: 24
  },
  text: {
    color: "#000000",
    fontWeight: "700"
  }
});

const mapStateToProps = state => ({
  appSettings: state.appSettings
});
export default connect(mapStateToProps)(SideMenu);
