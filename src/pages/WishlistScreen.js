import React from "react";
import {View, StyleSheet} from "react-native";
import {Text, Toolbar} from "components";
import {connect} from "react-redux";

class WishlistScreen extends React.PureComponent {
  static navigationOptions = {
    header: <Toolbar backButton cartButton title="WishlistScreen" />,
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>WishlistScreen</Text>
      </View>
    );
  }
}

mapStateToProps = state => {
  wishlist: state.wishlist;
};

export default connect()(WishlistScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
