import React from "react";
import {StyleSheet, View, FlatList, ActivityIndicator, Image, TouchableOpacity} from "react-native";
import {
  Toolbar,
  Container,
  Text,
  Button,
  Icon,
  EmptyList,
  WishlistIcon,
  HTMLRender,
} from "components";
import {connect} from "react-redux";
import Toast from "react-native-simple-toast";
import ProductItem from "./ProductItem";
import {ApiClient} from "service";
import {FlatGrid} from "react-native-super-grid";
import Filter from "./Filter";
import Modal from "react-native-modal";
import {isEmpty} from "lodash";
import CategoryItem from "../home/CategoryItem";
import SortOptions from "./SortOptions";
import StarRating from "react-native-star-rating";
import {brand} from "store/actions";

class ProductScreen extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    const {category_id, featured, sortby, on_sale} = props.navigation.state.params;
    const {price} = props.appSettings;

    this.state = {
      products: [],
      loading: true,
      hasMore: false,
      showFilter: false,
      showFilterSort: false,
      categories: [],
      attributes: [],
    };
    this.params = {
      page: 1,
      per_page: 20,
      on_sale,
      sort: sortby || "popularity",
      featured,
      category: category_id,
      brand: "",
      min_price: price.min || 0,
      max_price: price.max || "",
    };
    this.paramsForCat = {
      page: 1,
      per_page: 20,
      on_sale,
      sort: sortby || "popularity",
      featured,
      category: "",
      brand: "",
      min_price: price.min || 0,
      max_price: price.max || "",
    };
    this.attr = {};
  }

  openFilter = () => {
    this.setState({showFilter: true});
  };

  openSort = () => {
    this.setState({showFilterSort: true, hasMore: false});
  };

  closeFilter = () => {
    this.setState({showFilter: false});
  };

  closeSort = () => {
    this.setState({showFilterSort: false});
  };

  sortData = text => {
    this.setState({
      showFilterSort: false,
      products: [],
      hasMore: false,
      loading: true,
    });
    if (text == "featured") {
      this.params.featured = true;
    } else {
      this.params.sort = text;
    }
    this.params.page = 1;
    this.loadProducts();
  };

  componentDidMount() {
    this.loadProducts();
    if (this.params.category) {
      this.setState({loading: true});
      ApiClient.get("products/all-categories", {parent: this.params.category}).then(({data}) => {
        // this.setState({loading: false});
        this.setState({categories: data});
      });
    }

    const params = {
      category_id: this.params.category,
    };
    this.setState({loading: true});
    ApiClient.get("products/custom-attributes", params).then(({data}) => {
      console.log("Attributes");
      // this.setState({loading: false});
      this.setState({attributes: data});
    });
    // this.setState({loading: true});
    ApiClient.get("products/all-brands?hide_empty").then(({data}) => {
      this.setState({loading: false});
      console.log("Brand Filter");
      this.props.brand(data);
      // let newData = [...this.state.attributes, ...data];
      // this.setState({attributes: newData});
    });
  }

  loadProducts = () => {
    this.setState({loading: true});
    ApiClient.post("custom-products", this.attr, {params: this.params})
      .then(({data}) => {
        this.setState({loading: false});
        this.fetchAttributes(data);
      })
      .catch(e => {
        Toast.show(e.toString(), Toast.LONG);
        this.setState({
          loading: false,
        });
      });
  };

  fetchAttributes = async data => {
    await this.setState(prevState => ({
      products: [...prevState.products, ...data],
      hasMore: data.length == this.params.per_page,
      loading: false,
    }));
    //will use global attrributes
    /*const params = {
      product: this.state.products.map(item => item.id).join(),
      hide_empty: true,
    };
    ApiClient.get("products/custom-attributes", params).then(({data}) => {
      this.setState({attributes: data});
    });*/
  };

  onEndReached = () => {
    if (!this.state.hasMore) return;
    this.params.page++;
    this.setState({loading: true, hasMore: false}, () => this.loadProducts());
  };

  onFilter = (params, attr) => {
    this.params = params;
    this.attr = attr;
    this.setState({showFilter: false, products: [], loading: true, hasMore: false}, () =>
      this.loadProducts(),
    );
    const paramsData = {
      hide_empty: true,
      show_all: true,
      category_id: params.category,
    };
    this.setState({loading: true});
    ApiClient.get("products/custom-attributes", paramsData).then(({data}) => {
      this.setState({loading: false});
      console.log("Attributes Filter");
      this.setState({attributes: data});
    });
    this.setState({loading: true});
    ApiClient.get("products/all-brands?hide_empty").then(({data}) => {
      this.setState({loading: false});
      console.log("Brand Filter");
      this.props.brand(data);
      // let newData = [...this.state.attributes, ...data];
      // this.setState({attributes: newData});
    });
  };

  goToProductDetails = item => () => {
    this.props.navigation.navigate("ProductDetailScreen", item);
  };

  _renderItem = ({item, index}) => {
    var discount = Math.ceil(((item.regular_price - item.price) / item.regular_price) * 100);
    const {
      appSettings: {accent_color},
    } = this.props;
    return (
      <TouchableOpacity onPress={this.goToProductDetails(item)}>
        <View
          style={[
            styles.containerProduct,
            {alignItems: "center", paddingHorizontal: 4, paddingVertical: 16},
          ]}>
          {item.images.length > 0 && (
            <Image
              resizeMode="contain"
              style={{width: 100, height: 80, borderRadius: 8}}
              source={{uri: item.images[0].src}}
              indicatorColor={accent_color}
            />
          )}
          <View style={{flex: 1, marginEnd: 16}}>
            <Text
              style={[styles.itemMargin, {fontWeight: "600", fontSize: 12, marginBottom: 4}]}
              numberOfLines={1}>
              {item.name.toUpperCase()}
            </Text>
            {item.sku != "" && (
              <Text
                style={[styles.itemMargin, {fontWeight: "600", fontSize: 12, marginBottom: 4}]}
                numberOfLines={1}>
                {item.sku}
              </Text>
            )}
            <StarRating
              disabled
              maxStars={5}
              rating={parseInt(item.average_rating)}
              containerStyle={[styles.itemMargin, styles.star, {marginVertical: 4}]}
              starStyle={{marginEnd: 5}}
              starSize={10}
              halfStarEnabled
              emptyStarColor={accent_color}
              fullStarColor={accent_color}
              halfStarColor={accent_color}
            />
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              {item.price_html != "" && (
                <HTMLRender
                  html={item.price_html}
                  containerStyle={styles.itemMargin}
                  baseFontStyle={{fontSize: 12, fontWeight: "700"}}
                />
              )}
              <Image
                resizeMode="contain"
                source={require("../../assets/imgs/cart.png")}
                style={{width: 25, height: 25}}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderItemCat = ({item, index}) => <CategoryItem item={item} index={index} />;

  listHeaderComponent = () =>
    !isEmpty(this.state.categories) && (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={this.state.categories}
        keyExtractor={this._categoryKeyExtractor}
        renderItem={this._renderItemCat}
        removeClippedSubviews={true}
      />
    );

  _categoryKeyExtractor = item => "category_" + item.id;

  _keyExtractor = item => "products_" + item.id;

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  gotoSeperate = () => {
    return <View style={{borderBottomWidth: 2, borderColor: "#EEEEEE", marginHorizontal: 16}} />;
  };

  render() {
    const {products, loading, showFilter, showFilterSort, attributes} = this.state;
    const {
      appSettings: {accent_color},
    } = this.props;

    return (
      <Container>
        <View style={{width: "100%", flexDirection: "row", alignItems: "center"}}>
          <Button onPress={this.goBack} style={{padding: 16}}>
            <Icon color={"#000"} name="keyboard-backspace" type="MaterialIcons" size={24} />
          </Button>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 16,
                paddingHorizontal: 16,
                color: "#000",
              }}>
              Product
            </Text>
            <View style={{flexDirection: "row"}}>
              <Button onPress={this.openSort}>
                <Image
                  style={{width: 30, height: 30, resizeMode: "contain"}}
                  source={require("../../assets/imgs/sort.png")}
                />
              </Button>
              <Button onPress={this.openFilter}>
                <Image
                  style={{width: 30, height: 30, marginHorizontal: 10, resizeMode: "contain"}}
                  source={require("../../assets/imgs/filter.png")}
                />
              </Button>
            </View>
          </View>
        </View>
        {/* <Toolbar backButton title="PRODUCTS" /> */}
        {/* <View style={styles.filterContainer}>
          <Button style={styles.button} onPress={this.openFilter}>
            <Icon name="menu-unfold" type="AntDesign" size={20} />
            <Text style={styles.btntext}>Categories</Text>
          </Button>
        </View> */}
        <FlatList
          data={products}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ListEmptyComponent={<EmptyList loading={loading} label="Products not available" />}
          ListFooterComponent={
            products.length > 0 && loading ? (
              <ActivityIndicator color={accent_color} size="large" style={{padding: 16}} />
            ) : null
          }
          ListHeaderComponent={this.listHeaderComponent}
          showsVerticalScrollIndicator={!loading}
          onEndReached={this.onEndReached}
          ItemSeparatorComponent={this.gotoSeperate}
        />
        {/* <FlatGrid
          items={products}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          itemDimension={160}
          spacing={8}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.33}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={!loading}
          itemContainerStyle={{justifyContent: "flex-start"}}
          ListHeaderComponent={this.listHeaderComponent}
          ListEmptyComponent={<EmptyList loading={loading} label="Products not available" />}
          ListFooterComponent={
            products.length > 0 && loading ? (
              <ActivityIndicator color={accent_color} size="large" style={{padding: 16}} />
            ) : null
          }
        /> */}
        <Modal
          animationType="slide"
          isVisible={showFilter}
          hasBackdrop
          useNativeDriver
          hideModalContentWhileAnimating
          style={{margin: 0}}
          onBackButtonPress={this.closeFilter}
          onBackdropPress={this.closeFilter}
          onBackdropPress={this.closeFilter}>
          <Filter
            onBackPress={this.closeFilter}
            onFilter={this.onFilter}
            filterData={this.paramsForCat}
            attributes={attributes}
            seletedAttr={this.attr}
          />
        </Modal>
        <Modal
          style={{justifyContent: "flex-end", margin: 0, marginTop: "auto"}}
          onBackButtonPress={this.closeSort}
          onBackdropPress={this.closeSort}
          hasBackdrop
          useNativeDriver
          hideModalContentWhileAnimating
          isVisible={showFilterSort}>
          <SortOptions
            data={products}
            sort={this.params.sort}
            onBackButtonPress={this.closeSort}
            sortData={this.sortData}
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
  filterContainer: {
    elevation: 5,
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
  },
  button: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  btntext: {
    marginStart: 5,
  },
  containerProduct: {
    borderRadius: 3,
    // borderWidth: 0.5,
    //borderColor: "#bdbdbd",
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  star: {
    justifyContent: "flex-start",
  },
  itemMargin: {
    marginStart: 8,
    marginTop: 4,
  },
  right: {
    position: "absolute",
    end: 0,
    top: 0,
  },
});

const mapStateToProps = state => ({appSettings: state.appSettings});

const mapDispatchToProps = {
  brand,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductScreen);
