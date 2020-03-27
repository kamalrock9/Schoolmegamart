import React from "react";
import {StyleSheet, View, FlatList, ImageBackground, TouchableOpacity} from "react-native";
import {FlatListLoading, Toolbar, Container, Text, Button, Icon} from "components";
import Toast from "react-native-simple-toast";
import ProductItem from "./ProductItem";
import {ApiClient} from "service";
import {FlatGrid} from "react-native-super-grid";
import Filter from "./Filter";
import Modal from "react-native-modal";
import {withTranslation} from "react-i18next";
import {isEmpty} from "lodash";
import LinearGradient from "react-native-linear-gradient";
import CategoryItem from "../home/CategoryItem";
import PropTypes from "prop-types";
import {getTotalMemory} from "react-native-device-info";

class ProductScreen extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    // const { feature, sortby, on_sale } = props.navigation.state.params;
    console.log(props.navigation.state.params);

    const {params} = props.navigation.state.params;

    this.state = {
      products: [],
      refreshing: true,
      flatListEndReached: false,
      showFilter: false,
      showFilterSort: false,
      filterValues: {
        price: [],
        categories: [],
      },
      filterProducts: [],
      categories: [],
    };
    this.params = {
      page: 0,
      per_page: 10,
      on_sale: "",
      sort: "popularity",
      featured: "",
      category: params,
    };
  }

  openFilter = () => {
    this.setState({showFilter: true});
  };

  openFilterForSort = () => {
    this.setState({showFilterSort: true, flatListEndReached: false});
  };

  closeFilter = () => {
    this.setState({showFilter: false});
  };

  closeFilterForSort = () => {
    this.setState({showFilterSort: false});
  };

  sortData = text => () => {
    this.setState({
      showFilterSort: false,
      products: [],
      filterProducts: [],
      flatListEndReached: false,
    });
    this.params.sort = text;
    this.params.page = 0;
    this.loadProducts();
  };

  componentDidMount() {
    this.loadProducts();
    // this.props.navigation.addListener('focus',
    //   () => { this.loadProducts })
    const {params} = this.props.navigation.state.params;

    ApiClient.get("products/all-categories?parent=" + params).then(({data}) => {
      console.log(data);
      this.setState({categories: data});
    });
  }

  loadProducts = () => {
    if (this.state.flatListEndReached) {
      this.filter();
    }
    if (this.state.flatListEndReached) {
      return;
    }

    this.params.page++;

    console.log("load product");
    const {filterValues, sortBy} = this.state;
    let filterData = {};
    if (filterValues.pa_color) {
      filterData.pa_color = filterValues.pa_color;
    }
    if (filterValues.pa_size) {
      filterData.pa_size = filterValues.pa_size;
    }
    console.log(this.params);
    console.log(this.state);

    ApiClient.get("custom-products", this.params, filterData)
      .then(({data}) => {
        this.setState({
          products: this.state.products.concat(data),
          filterProducts: this.state.products.concat(data),
          flatListEndReached: data.length < this.params.per_page,
          refreshing: false,
        });
      })
      .catch(e => {
        Toast.show(e.toString(), Toast.LONG);
      });

    let p = this.joinProductIds(this.state.filterProducts);
    let param = {
      product: p,
    };
    ApiClient.get("products/custom-attributes?hide_empty=true", param).then(({data}) => {
      for (var i = 0; i < data.length; i++) {
        let name = data[i].name;
        let newdata = {...this.state.filterValues, [name]: data[i]};
        this.setState({filterValues: newdata});
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
    this.setState({filterValues});
    if (filterValues.pa_size || filterValues.pa_color) {
      this.setState({flatListEndReached: false});
    }
  };
  filter = () => {
    console.log("filter");
    const {filterValues, products, flatListEndReached} = this.state;
    // this.setState({ filterProducts: [], products: [], flatListEndReached: false });
    let filterProducts = [];

    if (!flatListEndReached) {
      this.loadProducts();
    }

    /******FILTER*****/
    console.log("after load");
    filterProducts = products.filter(item => {
      return (
        filterValues.price.length == 0 ||
        (filterValues.price[0] <= item.price && filterValues.price[1] >= item.price)
      );
    });

    this.setState({filterProducts, showFilter: false});
  };

  _renderItem = ({item, index}) => {
    return (
      /***** For providing dynamic width to scaledimages 
      {width - (MarginVertical of Container + borderWidth)}/2] ****/
      <ProductItem item={item} />
    );
  };

  getToProductPage = param => () => {
    this.params.category = param;
    this.params.page = 0;
    this.setState({flatListEndReached: false, products: []});
    this.loadProducts();
  };

  CategoryItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[
          {width: 80, height: 60, borderRadius: 3, marginTop: 5, marginBottom: 15},
          index == 0 ? {marginStart: 12, marginEnd: 10} : {marginEnd: 10},
        ]}
        onPress={this.getToProductPage(item.id)}>
        <ImageBackground
          source={{
            uri: item.image ? item.image.src : "https://source.unsplash.com/1600x900/?" + item.name,
          }}
          style={{width: 80, height: 60, flex: 1, borderRadius: 3}}
          resizeMode="cover">
          <LinearGradient
            colors={["#afafaf5e", "#000000ff"]}
            style={{position: "absolute", width: "100%", bottom: 0}}>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 10,
                paddingVertical: 2,
                fontWeight: "700",
              }}>
              {item.name.toUpperCase()}
            </Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  listHeaderComponent = () =>
    !isEmpty(this.state.categories) && (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={this.state.categories}
        keyExtractor={this._categoryKeyExtractor}
        renderItem={this.CategoryItem}
        removeClippedSubviews={true}
      />
    );

  _categoryKeyExtractor = item => "category_" + item.id;

  _keyExtractor = item => "products_" + item.id;

  render() {
    const {
      products,
      flatListEndReached,
      refreshing,
      showFilter,
      showFilterSort,
      filterValues,
      filterProducts,
      categories,
    } = this.state;
    const {t} = this.props;
    return (
      <Container>
        <Toolbar backButton title="PRODUCTS" />
        <View style={styles.filterView}>
          <Button style={styles.button} onPress={this.openFilter}>
            <Icon name="md-menu" size={20} />
            <Text style={styles.btntext}>Categories</Text>
          </Button>
          <Button style={styles.button} onPress={this.openFilterForSort}>
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
          itemContainerStyle={{justifyContent: "flex-start"}}
          ListHeaderComponent={this.listHeaderComponent}
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
            filter={this.filter}
          />
        </Modal>
        <Modal
          style={{justifyContent: "flex-end", margin: 0, marginTop: "auto"}}
          onBackButtonPress={this.closeFilterForSort}
          onBackdropPress={this.closeFilterForSort}
          hasBackdrop
          useNativeDriver
          animationType="slide"
          transparent={true}
          backdropColor={"black"}
          backdropOpacity={1}
          visible={showFilterSort}
          onRequestClose={this.closeFilterForSort}>
          <View style={{padding: 15, backgroundColor: "#fff"}}>
            <View style={{flexDirection: "row", justifyContent: "space-between", paddingBottom: 5}}>
              <Text style={{fontWeight: "400", fontSize: 16}}>Sort By</Text>
              <Button onPress={this.closeFilterForSort}>
                <Icon type="Entypo" name="cross" size={24} />
              </Button>
            </View>
            <Button style={styles.sortbtn} onPress={this.sortData("popularity")}>
              <Text style={{color: this.params.sort == "popularity" ? "#0275f9" : "#000"}}>
                {t("POPULARITY")}
              </Text>
              {this.params.sort == "popularity" && (
                <Icon
                  name="md-checkmark"
                  size={20}
                  color={this.params.sort == "popularity" ? "#0275f9" : "#000"}
                />
              )}
            </Button>
            <Button style={styles.sortbtn} onPress={this.sortData("rating")}>
              <Text style={{color: this.params.sort == "rating" ? "#0275f9" : "#000"}}>
                {t("AVERAGE_RATING")}
              </Text>
              {this.params.sort == "rating" && (
                <Icon
                  name="md-checkmark"
                  size={20}
                  color={this.params.sort == "rating" ? "#0275f9" : "#000"}
                />
              )}
            </Button>
            <Button style={styles.sortbtn} onPress={this.sortData("date")}>
              <Text style={{color: this.params.sort == "date" ? "#0275f9" : "#000"}}>
                {t("NEWNESS")}
              </Text>
              {this.params.sort == "date" && (
                <Icon
                  name="md-checkmark"
                  size={20}
                  color={this.params.sort == "date" ? "#0275f9" : "#000"}
                />
              )}
            </Button>
            <Button style={styles.sortbtn} onPress={this.sortData("price_asc")}>
              <Text style={{color: this.params.sort == "price_asc" ? "#0275f9" : "#000"}}>
                {t("PRICE_ASC")}
              </Text>
              {this.params.sort == "price_asc" && (
                <Icon
                  name="md-checkmark"
                  size={20}
                  color={this.params.sort == "price_asc" ? "#0275f9" : "#000"}
                />
              )}
            </Button>
            <Button style={styles.sortbtn} onPress={this.sortData("price_desc")}>
              <Text style={{color: this.params.sort == "price_desc" ? "#0275f9" : "#000"}}>
                {t("PRICE_DESC")}
              </Text>
              {this.params.sort == "price_desc" && (
                <Icon
                  name="md-checkmark"
                  size={20}
                  color={this.params.sort == "price_desc" ? "#0275f9" : "#000"}
                />
              )}
            </Button>
          </View>
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
  sortbtn: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
});

// ProductScreen.propTypes = {
//   feature: PropTypes.bool,
//   sortby: PropTypes.string,
//   on_sale: PropTypes.string
// }

// ProductScreen.defaultProps = {
//   feature: false,
//   sortby: 'popularity',
//   on_sale: ''
// }

export default withTranslation()(ProductScreen);
