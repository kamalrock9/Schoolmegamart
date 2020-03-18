import React from "react";
import {StyleSheet, View} from "react-native";
import {FlatListLoading, Toolbar, Container, Text, Button, Icon} from "components";
import Toast from "react-native-simple-toast";
import ProductItem from "./ProductItem";
import {ApiClient} from "service";
import {FlatGrid} from "react-native-super-grid";
import Filter from "./Filter";
import Modal from "react-native-modal";
class ProductScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      refreshing: true,
      flatListEndReached: false,
      showFilter: false,
    };
    this.params = {
      page: 0,
      per_page: 10,
      sort: "default",
    };
  }

  static navigationOptions = {
    header: null,
  };

  openFilter = () => {
    console.log("hey");
    this.setState({showFilter: true});
  };

  closeFilter = () => {
    this.setState({showFilter: false});
  };

  componentDidMount() {
    this.loadProducts();
  }

  loadProducts = () => {
    if (this.state.flatListEndReached) {
      return;
    }
    this.params.page++;
    ApiClient.get("custom-products", this.params)
      .then(({data}) => {
        this.setState({
          products: [...this.state.products, ...data],
          flatListEndReached: data.length < this.params.per_page,
          refreshing: false,
        });
      })
      .catch(e => {
        Toast.show(e.toString(), Toast.LONG);
      });
  };

  _renderItem = ({item, index}) => {
    return (
      /***** For providing dynamic width to scaledimages 
      {width - (MarginVertical of Container + borderWidth)}/2] ****/
      <ProductItem item={item} />
    );
  };
  _keyExtractor = item => "products_" + item.id;

  render() {
    const {products, flatListEndReached, refreshing, showFilter} = this.state;
    return (
      <Container>
        <Toolbar backButton title="PRODUCTS" />
        <View style={styles.filterView}>
          <Button style={styles.button}>
            <Icon name="md-menu" size={20} />
            <Text style={styles.btntext}>Categories</Text>
          </Button>
          <Button style={styles.button}>
            <Icon name="exchange" type="FontAwesome" size={20} />
            <Text style={styles.btntext}>Sort By</Text>
          </Button>
          <Button style={styles.button} onPress={this.openFilter}>
            <Icon name="filter" type="AntDesign" size={20} />
            <Text style={styles.btntext}>Filter</Text>
          </Button>
        </View>
        <FlatGrid
          items={products}
          //keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          itemDimension={160}
          spacing={8}
          //numColumns={2}
          // style={{margin: 2}}
          onEndReached={this.loadProducts}
          onEndReachedThreshold={0.33}
          showsVerticalScrollIndicator={!refreshing}
          itemContainerStyle={{justifyContent: "flex-start"}}
          ListFooterComponent={
            <FlatListLoading bottomIndicator={!flatListEndReached} centerIndicator={refreshing} />
          }
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={showFilter}
          onRequestClose={this.closeFilter}>
          <Filter
            // data={this.state.flights}
            onBackPress={this.closeFilter}
            // filterValues={this.state.filterValues}
            // onChangeFilter={this.onChangeFilter}
            // flight_type={flight_type}
            // filter={this.filter}
          />
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterView: {
    elevation: 5,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  btntext: {marginStart: 5},
});

export default ProductScreen;
