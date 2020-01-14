import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../components";
import { connect } from "react-redux";
import { Toolbar } from "../components";

class WishList extends React.PureComponent {
  static navigationOptions = {
    header: <Toolbar backButton cartButton title="WishList" />
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>WishList</Text>
      </View>
    );
  }
}

mapStateToProps = state => {
  wishlist: state.wishlist;
};

export default connect()(WishList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
