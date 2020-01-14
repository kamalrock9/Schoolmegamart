import React from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { connect } from "react-redux";
import { getProducts } from "../../rest";
import { ProductItem, FlatListLoading } from "../components";
import { Toolbar } from "../components";

class Products extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    header: <Toolbar backButton />
  });

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      refreshing: true,
      flatListEndReached: false
    };
    this.params = {
      page: 0,
      per_page: 20
    };
    this.loadProducts();
  }

  loadProducts = () => {
    if (this.state.flatListEndReached) {
      return;
    }
    this.params.page++;
    getProducts(this.params)
      .then(response => {
        this.setState({
          products: [...this.state.products, ...response],
          flatListEndReached:
            response.length < this.params.per_page ? true : false,
          refreshing: false
        });
      })
      .catch(error => {
        alert(error);
      });
  };

  _renderItem = ({ item, index }) => {
    return (
      /***** For providing dynamic width to scaledimages 
      {width - (MarginVertical of Container + borderWidth)}/2] ****/
      <ProductItem
        item={item}
        width={(width - 16) / 2}
        containerStyle={{ margin: 2 }}
      />
    );
  };
  _keyExtractor = (item, index) => item.name + item.id;

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.products}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          numColumns={2}
          style={{ margin: 2 }}
          onEndReached={this.loadProducts}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={!this.state.refreshing}
          ListFooterComponent={
            <FlatListLoading
              bottomIndicator={!this.state.flatListEndReached}
              centerIndicator={this.state.refreshing}
            />
          }
        />
      </View>
    );
  }
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default connect()(Products);
