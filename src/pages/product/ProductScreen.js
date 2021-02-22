import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Switch,
  Dimensions,
} from "react-native";
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
import {brand, rating, getCartCount} from "store/actions";
import analytics from "@react-native-firebase/analytics";
import {SvgCart, SvgList, SvgSort, SvgFilter, SvgGrid} from "../../assets/svgs";

const {width} = Dimensions.get("screen");
class ProductScreen extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    const {category_id, featured, sortby, on_sale} = props.navigation.state.params;
    const {price} = props.appSettings;

    this.state = {
      quantity: 1,
      variation: {},
      selectedAttrs: {},
      products: [],
      loading: true,
      hasMore: false,
      showFilter: false,
      showFilterSort: false,
      categories: [],
      attributes: [],
      gridView: false,
      title: "",
      header: category_id ? category_id.name : "",
      showLoader: false,
    };
    this.params = {
      page: 1,
      per_page: 6,
      on_sale,
      sort: sortby || "popularity",
      featured,
      category: category_id ? category_id.id : "",
      brand: "",
      rating: "",
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
      rating: "",
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
    this.trackScreenView("Product Screen");
    const {customPage} = this.props.navigation.state.params;
    console.log(this.props.navigation.state.params);
    if (customPage) {
      this.setState({loading: true});
      ApiClient.get("/get-app-page-by-id?page_id=" + customPage)
        .then(response => {
          //this.setState({title: data.page_title});
          if (response.data.status) {
            ApiClient.get("/get-products-by-id?include=" + response.data.product_id)
              .then(({data}) => {
                this.setState({header: response.data.page_title});
                //this.fetchAttributes(data);
                this.setState({loading: false, products: data});
              })
              .catch(error => {
                this.setState({loading: false});
              });
          }
        })
        .catch(error => {
          this.setState({loading: false});
        });
    } else {
      console.log("else");
      const params = {
        category_id: this.params.category,
      };
      this.setState({loading: true});
      ApiClient.get("products/custom-attributes/?show_all=yes", params).then(({data}) => {
        console.log("Attributes");
        //this.setState({loading: true});
        this.setState({attributes: data});
      });
      // this.setState({loading: true});
      ApiClient.get("products/all-brands?hide_empty", params).then(({data}) => {
        //this.setState({loading: true});
        console.log("Brand Filter");
        this.props.brand(data);
        // let newData = [...this.state.attributes, ...data];
        // this.setState({attributes: newData});
      });
      console.log(params);
      // this.setState({loading: true});
      ApiClient.get("products/ratings?", params).then(({data}) => {
        //this.setState({loading: false});
        console.log("Rating Filter");
        this.props.rating(data);
        // let newData = [...this.state.attributes, ...data];
        // this.setState({attributes: newData});
      });
      this.loadProducts();
    }

    if (this.params.category) {
      this.setState({loading: true});
      ApiClient.get("products/all-categories", {parent: this.params.category}).then(({data}) => {
        //  this.setState({loading: false});
        this.setState({categories: data});
      });
    }
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  loadProducts = () => {
    this.setState({loading: true});
    console.log(this.attr);
    console.log(this.params);
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
      // loading: false,
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
    this.paramsForCat.category = params.category;
    this.paramsForCat.brand = params.brand;
    this.paramsForCat.rating = params.rating;
    this.attr = attr;

    const paramsData = {
      hide_empty: true,
      show_all: true,
      category_id: params.category,
    };
    this.setState({loading: true});
    ApiClient.get("products/custom-attributes/?show_all=yes", paramsData).then(({data}) => {
      //this.setState({loading: false});
      console.log("Attributes Filter");
      this.setState({attributes: data});
    });
    this.setState({loading: true});
    ApiClient.get("products/all-brands?hide_empty", paramsData).then(({data}) => {
      //this.setState({loading: false});
      console.log("Brand Filter");
      this.props.brand(data);
      // let newData = [...this.state.attributes, ...data];
      // this.setState({attributes: newData});
    });
    ApiClient.get("products/ratings?", paramsData).then(({data}) => {
      //this.setState({loading: false});
      console.log("Rating Filter");
      this.props.rating(data);
      // let newData = [...this.state.attributes, ...data];
      // this.setState({attributes: newData});
    });

    this.setState({showFilter: false, products: [], loading: true, hasMore: false}, () =>
      this.loadProducts(),
    );
  };

  goToProductDetails = item => () => {
    this.props.navigation.navigate("ProductDetailScreen", item);
  };

  _addToCart = product => () => {
    console.log(product);
    const {quantity} = this.state;
    let data = {id: product.id, quantity: this.state.quantity};

    if (product.in_stock == false) {
      Toast.show("Product is out of stock.", Toast.SHORT);
      return;
    }

    switch (product.type) {
      case "simple":
        data.quantity = quantity;
        break;
      default:
        this.props.navigation.navigate("ProductDetailScreen", {item: product});
    }

    if (this.props.appSettings.pincode_active) {
      if (this.state.postcode == "") {
        Toast.show("Please select a pincode first.", Toast.SHORT);
        return;
      }
      if (isEmpty(this.state.deliverDetails)) {
        Toast.show("Please apply the pincode first.", Toast.SHORT);
        return;
      }
      if (
        this.state.deliverDetails.hasOwnProperty("delivery") &&
        !this.state.deliverDetails.delivery
      ) {
        Toast.show("Delivery is not available for your location.", Toast.SHORT);
        return;
      }
    }
    //console.log(JSON.stringify(data));
    this.setState({showLoader: true});
    ApiClient.post("/cart/add", data)
      .then(({data}) => {
        console.log(data);
        this.setState({showLoader: false});
        if (data.code) {
          this.props.getCartCount();
          Toast.show(data.message, Toast.LONG);
        }
        this.setState({
          cartMsg: Array.isArray(data) ? data.map(e => e.message).join(", ") : data.message,
        });
        if (this.isError(data)) {
          //console.log("error");
        } else {
          if (isBuyNow) {
            this.props.navigation.navigate("Cart", this.state);
          } else {
            this.setState({modalVisible: true});
          }
        }
      })
      .catch(error => {
        this.setState({loading: true});
        //console.log(error);
      });
  };

  _renderItem = ({item, index}) => {
    // var discount = Math.ceil(((item.regular_price - item.price) / item.regular_price) * 100);
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
              source={{
                uri: item.images[0].src
                  ? item.images[0].src
                  : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
              }}
              indicatorColor={accent_color}
            />
          )}
          <View style={{flex: 1, marginEnd: 16}}>
            <Text style={[styles.itemMargin, {fontWeight: "600", fontSize: 12, marginBottom: 4}]}>
              {item.name.toUpperCase()}
            </Text>
            {item.sku != "" && (
              <Text style={[styles.itemMargin, {fontWeight: "600", fontSize: 12, marginBottom: 4}]}>
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
              <Button onPress={this._addToCart(item)}>
                <Icon name="handbag" type="SimpleLineIcons" size={24} />
              </Button>
              {/* <Image
                resizeMode="contain"
                source={require("../../assets/imgs/cart.png")}
                style={{width: 25, height: 25}}
              /> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderItemGridView = ({item, index}) => {
    var discount = Math.round(((item.regular_price - item.price) / item.regular_price) * 100, 2);
    const {
      appSettings: {accent_color},
    } = this.props;
    return (
      <TouchableOpacity onPress={this.goToProductDetails(item)}>
        <>
          <View
            style={[
              index % 2 == 0 ? {marginStart: 8, marginEnd: 8} : {marginStart: 4},
              {
                width: width / 2 - 24,
                //backgroundColor: "#EAEAF1",
                paddingVertical: 20,
                borderRadius: 8,
                marginTop: 8,
                alignItems: "center",
                borderColor: "#f8f8fa",
                borderWidth: 4,
              },
            ]}>
            {item.images.length > 0 && (
              <Image
                resizeMode="contain"
                style={{width: width / 3, height: 150}}
                source={{
                  uri: item.images[0].src
                    ? item.images[0].src
                    : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
                }}
                indicatorColor={accent_color}
              />
            )}

            {item.on_sale && (
              <View
                style={{
                  marginStart: 2,
                  marginTop: 2,
                  position: "absolute",
                  top: 0,
                  start: 0,
                  backgroundColor: "#EB6969",
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  elevation: 8,
                }}>
                <Text style={{fontSize: 10, color: "#fff", fontWeight: "600"}}>
                  {isFinite(discount)
                    ? "-" + Math.round((discount + Number.EPSILON) * 10) / 10 + "%"
                    : "SALE"}
                </Text>
              </View>
            )}
            <WishlistIcon style={styles.right} item={item} size={20} />
          </View>
          {/* <View style={{marginHorizontal: 4, borderTopWidth: 2, borderColor: "#f8f8f8"}}> */}
          <Text style={[styles.itemMargin, {fontWeight: "600", fontSize: 12}]}>{item.name}</Text>
          {item.sku != "" && (
            <Text
              style={[
                styles.itemMargin,
                {fontWeight: "600", fontSize: 12, marginBottom: 4, color: "#000"},
              ]}>
              {item.sku}
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingEnd: 16,
              marginBottom: 8,
              alignItems: "flex-end",
            }}>
            <View>
              {item.price_html != "" && (
                <HTMLRender
                  html={item.price_html}
                  containerStyle={styles.itemMargin}
                  baseFontStyle={{fontSize: 12, fontWeight: "700"}}
                />
              )}
              <StarRating
                disabled
                maxStars={5}
                rating={parseInt(item.average_rating)}
                containerStyle={[styles.itemMargin, styles.star]}
                starStyle={{marginEnd: 5}}
                starSize={14}
                halfStarEnabled
                emptyStarColor={accent_color}
                fullStarColor={accent_color}
                halfStarColor={accent_color}
              />
            </View>
            <Button style={{paddingBottom: 2}} onPress={this._addToCart(item)}>
              <Icon name="handbag" type="SimpleLineIcons" size={24} />
            </Button>
          </View>
          {/* </View> */}
        </>
      </TouchableOpacity>
    );
  };

  _renderItemCat = ({item, index}) => (
    <Categories item={item} index={index} navigation={this.props.navigation} />
  );

  // _listHeaderComponent = () => {
  //   return (
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         width: "100%",
  //         justifyContent: "space-between",
  //         padding: 16,
  //         alignItems: "center",
  //       }}>
  //       <Text style={{fontWeight: "500"}}>Same For Shipping</Text>
  //       <Switch value={this.state.gridView} />
  //     </View>
  //   );
  // };

  listHeaderComponent = () => (
    <>
      <Text
        style={{
          fontWeight: "600",
          fontSize: 16,
          padding: 16,
          color: "#000",
          // flex: 1,
          alignSelf: "center",
        }}>
        {this.state.header != "" ? this.state.header : "Product"}
      </Text>

      {this.state.title != "" && (
        <Text style={{marginHorizontal: 16, fontWeight: "600", alignSelf: "center"}}>
          {this.state.title}
        </Text>
      )}
      {!isEmpty(this.state.categories) && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={this.state.categories}
          keyExtractor={this._categoryKeyExtractor}
          renderItem={this._renderItemCat}
          removeClippedSubviews={true}
          //ListHeaderComponent={this._listHeaderComponent}
        />
      )}
    </>
  );

  _categoryKeyExtractor = item => "category_" + item.id;

  _keyExtractor = item => "products_" + item.id;

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  gotoSeperate = () => {
    return <View style={{borderBottomWidth: 2, borderColor: "#EEEEEE", marginHorizontal: 16}} />;
  };

  _gotoChangeGrid = () => {
    this.setState({gridView: !this.state.gridView});
  };

  gotoPage = () => {
    this.props.navigation.navigate("Cart");
  };

  render() {
    const {
      products,
      loading,
      showFilter,
      showFilterSort,
      attributes,
      gridView,
      title,
      header,
      showLoader,
    } = this.state;
    const {
      appSettings: {accent_color, toolbarbadgecolor},
      count,
    } = this.props;
    return (
      <Container>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FAECE2",
            paddingEnd: 8,
          }}>
          <Button onPress={this.goBack} style={{padding: 16}}>
            <Icon color={"#000"} name="keyboard-backspace" type="MaterialIcons" size={24} />
          </Button>

          {title == "" && (
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Button onPress={this.gotoPage}>
                <SvgCart style={styles.drawerItemIcon} width={18} height={18} />
                {/* {count > 0 && (
                    <View
                      style={[styles.badge, {backgroundColor: toolbarbadgecolor || accent_color}]}>
                      <Text style={styles.badgeText}>{count}</Text>
                    </View>
                  )} */}
              </Button>
              <TouchableOpacity style={{}} onPress={this._gotoChangeGrid}>
                {gridView ? (
                  <SvgGrid style={styles.drawerItemIcon} width={18} height={18} />
                ) : (
                  <SvgList style={styles.drawerItemIcon} width={18} height={18} />
                )}
              </TouchableOpacity>
              <Button onPress={this.openSort}>
                <SvgSort style={styles.drawerItemIcon} width={18} height={18} />
              </Button>
              <Button onPress={this.openFilter}>
                <SvgFilter style={[styles.drawerItemIcon, {marginEnd: 8}]} width={18} height={18} />
              </Button>
            </View>
          )}
        </View>
        {/* <Toolbar backButton title="PRODUCTS" /> */}
        {/* <View style={styles.filterContainer}>
          <Button style={styles.button} onPress={this.openFilter}>
            <Icon name="menu-unfold" type="AntDesign" size={20} />
            <Text style={styles.btntext}>Categories</Text>
          </Button>
        </View> */}

        {!isEmpty(products) && gridView ? (
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
        ) : !isEmpty(products) ? (
          <FlatGrid
            items={products}
            renderItem={this._renderItemGridView}
            keyExtractor={this._keyExtractor}
            itemDimension={160}
            spacing={8}
            onEndReached={this.onEndReached}
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={!loading}
            itemContainerStyle={{justifyContent: "flex-start"}}
            ListHeaderComponent={this.listHeaderComponent}
            ListFooterComponent={
              products.length > 0 && loading ? (
                <ActivityIndicator color={accent_color} size="large" style={{padding: 16}} />
              ) : null
            }
            ListEmptyComponent={<EmptyList loading={loading} label="Products not available" />}
          />
        ) : isEmpty(products) && loading ? (
          <ActivityIndicator color={accent_color} size="large" style={{padding: 16, flex: 1}} />
        ) : (
          isEmpty(products) &&
          !loading && (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
              <Text>Products not available...</Text>
            </View>
          )
        )}

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
        <Modal
          animationType="slide"
          isVisible={showLoader}
          hasBackdrop
          useNativeDriver
          hideModalContentWhileAnimating
          style={{margin: 0}}>
          <ActivityIndicator color={accent_color} size="large" style={{padding: 16, flex: 1}} />
        </Modal>
      </Container>
    );
  }
}

function Categories({item, index, navigation}) {
  const goToProductScreen = () => {
    navigation.push("ProductScreen", {category_id: item});
  };
  return (
    <TouchableOpacity
      style={[
        {
          marginBottom: 15,
          backgroundColor: "#ED7833",
          alignItems: "center",
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 4,
          height: 110,
          justifyContent: "center",
        },
        index == 0 ? {marginStart: 18, marginEnd: 16} : {marginEnd: 16},
      ]}
      onPress={goToProductScreen}>
      <Image
        source={{
          uri: item.image
            ? typeof item.image == "string"
              ? item.image
              : item.image.src
            : "https://source.unsplash.com/1600x900/?" + item.name,
        }}
        style={{width: 40, height: 40}}
        resizeMode="cover"
      />
      <Text
        style={{
          color: "#fff",
          textAlign: "center",
          fontSize: 10,
          width: width / 5,
          paddingVertical: 2,
          fontWeight: "500",
        }}>
        {item.name.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
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
    marginEnd: 2,
    marginTop: 2,
    borderRadius: 4,
    backgroundColor: "#f8f8fa",
  },
  badge: {
    position: "absolute",
    end: 6,
    top: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "600",
  },
  drawerItemIcon: {
    color: "#000000",
    fontWeight: "900",
    marginHorizontal: 8,
  },
});

const mapStateToProps = state => ({appSettings: state.appSettings, count: state.cartCount});

const mapDispatchToProps = {
  brand,
  rating,
  getCartCount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductScreen);
