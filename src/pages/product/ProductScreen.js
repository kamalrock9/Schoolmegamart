import React from "react";
import { StyleSheet, View } from "react-native";
import { FlatListLoading, Toolbar, Container, Text, Button, Icon } from "components";
import Toast from "react-native-simple-toast";
import ProductItem from "./ProductItem";
import { ApiClient } from "service";
import { FlatGrid } from "react-native-super-grid";
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
      filterValues: {
        price: [],
        categories: [],
      },
      filterProducts: []
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
    this.setState({ showFilter: true });
  };

  closeFilter = () => {
    this.setState({ showFilter: false });
  };

  componentDidMount() {
    this.loadProducts();
  }

  loadProducts = () => {
    if (this.state.flatListEndReached) {
      return;
    }
    this.params.page++;

    const { filterValues } = this.state;
    let params = {
      attribute: "Color",
      attribute_term: filterValues.SelectedColor
    }

    ApiClient.get("custom-products", this.params)
      .then(({ data }) => {
        this.setState({
          products: [...this.state.products, ...data],
          filterProducts: [...this.state.products, ...data],
          flatListEndReached: data.length < this.params.per_page,
          refreshing: false,
        });
      })
      .catch(e => {
        Toast.show(e.toString(), Toast.LONG);
      });

    let p = this.joinProductIds(this.state.filterProducts);
    let param = {
      product: p
    }
    ApiClient.get("products/custom-attributes?hide_empty=true", param).then(({ data }) => {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        let name = data[i].name;

        let newdata = { ...this.state.filterValues, [name]: data[i].options }
        console.log(newdata);
        this.setState({ filterValues: newdata })
        console.log(this.state.filterValues);

      }
    });
  };

  joinProductIds(p) {
    let arr = [];
    for (let i of p) {
      if (i.attributes.length > 0) {
        arr.push(i.id);
      }
    }
    return arr.join(",");
  }

  onChangeFilter = filterValues => {
    console.log(filterValues);
    this.setState({ filterValues });

  };
  filter = () => {
    const { filterValues, products } = this.state
    let filterProducts = [];

    /******FILTER*****/
    filterProducts = products.filter(item => {
      return (
        (filterValues.price.length == 0 ||
          (filterValues.price[0] <= item.price &&
            filterValues.price[1] >= item.price))
      )
    })

    this.setState({ filterProducts, showFilter: false });
  }

  _renderItem = ({ item, index }) => {
    return (
      /***** For providing dynamic width to scaledimages 
      {width - (MarginVertical of Container + borderWidth)}/2] ****/
      <ProductItem item={item} />
    );
  };
  _keyExtractor = item => "products_" + item.id;

  render() {
    const { products, flatListEndReached, refreshing, showFilter, filterValues, filterProducts } = this.state;
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
          items={filterProducts}
          //keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          itemDimension={160}
          spacing={8}
          //numColumns={2}
          // style={{margin: 2}}
          onEndReached={this.loadProducts}
          onEndReachedThreshold={0.33}
          showsVerticalScrollIndicator={!refreshing}
          itemContainerStyle={{ justifyContent: "flex-start" }}
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
            data={products}
            onBackPress={this.closeFilter}
            filterVal={filterValues}
            onChangeFilter={this.onChangeFilter}
            // flight_type={flight_type}
            filter={this.filter}
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
  btntext: { marginStart: 5 },
});

export default ProductScreen;
