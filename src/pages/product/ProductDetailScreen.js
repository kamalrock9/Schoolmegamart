import React, {Component, Fragment} from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Linking,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import {connect} from "react-redux";
import StarRating from "react-native-star-rating";
import RNFetchBlob from "rn-fetch-blob";
import Share from "react-native-share";
import Modal from "react-native-modal";
import {isEmpty, unionBy} from "lodash";
import {
  Slider,
  Toolbar,
  HTMLRender,
  QuantitySelector,
  Text,
  Button,
  Icon,
  Container,
  WishlistIcon,
} from "components";
import {CustomPicker} from "react-native-custom-picker";
import SpecificationRow from "./SpecificationRow";
import MiniCart from "./MiniCart";
import ProductsRow from "./ProductsRow";
import {ApiClient} from "service";
import {getCartCount, changeShippingPincode} from "store/actions";
import {FlatGrid} from "react-native-super-grid";
import Toast from "react-native-simple-toast";
import {withTranslation} from "react-i18next";
import Constants from "../../service/Config";
import InAppBrowser from "react-native-inappbrowser-reborn";
import SwiperFlatList from "react-native-swiper-flatlist";

const {width} = Dimensions.get("window");
class ProductDetailScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params);
    this.state = {
      quantity: 1,
      product: this.props.navigation.state.params,
      cartMsg: "",
      modalVisible: false,
      attributes: [],
      selectedAttrs: {},
      variation: {},
      postcode: props.shipping.postcode || "",
      deliverDetails: {},
      loading: false,
      checked: false,
      index: 0,
      isOpenModal: false,
      name: "",
      email: "",
      phone: "",
      qty: "",
      enquiry: "",
    };
  }
  componentDidMount() {
    const {product, postcode} = this.state;
    let attributes = [];
    for (let attr of product.attributes) {
      if (attr.variation && attr.visible) {
        attributes.push(attr);
      }
    }
    this.setState({attributes});
    console.log(attributes);
    this.setup();
    if (postcode !== "") {
      this.submitPostcode();
    }
  }

  onchangename = text => {
    this.setState({name: text});
  };
  onchangeemail = text => {
    this.setState({email: text});
  };
  onchangephone = text => {
    this.setState({phone: text});
  };
  onchangequantity = text => {
    this.setState({qty: text});
  };
  onchangeenquiry = text => {
    this.setState({enquiry: text});
  };

  setup = () => {
    if (this.state.product.upsell_ids.length > 0) {
      ApiClient.get("/get-products-by-id", {include: this.state.product.upsell_ids.join()})
        .then(({data}) => {
          this.setState(prevState => ({
            product: {...prevState.product, upsell: data},
          }));
        })
        .catch(error => {});
    }
    if (this.state.product.related_ids.length > 0) {
      ApiClient.get("/get-products-by-id", {include: this.state.product.related_ids.join()})
        .then(({data}) => {
          this.setState(prevState => ({
            product: {...prevState.product, related: data},
          }));
        })
        .catch(error => {});
    }
    if (this.state.product.grouped_products.length > 0) {
      ApiClient.get("/get-products-by-id", {include: this.state.product.grouped_products.join()})
        .then(({data}) => {
          let newData = data.map(item => {
            let varia = {...item, quantity: 0};
            return varia;
          });
          console.log(newData);
          this.setState(prevState => ({
            product: {...prevState.product, group: newData},
          }));
        })
        .catch(error => {});
    }
  };

  shareProduct = () => {
    console.log("hey kamal");
    RNFetchBlob.fetch("GET", this.state.product.images[0].src)
      .then(resp => {
        alert("response : ", resp.info());
        let base64image = resp.data;
        this.share("data:image/png;base64," + base64image);
      })
      .catch(err => console.log(err));
  };

  share = base64image => {
    let shareOptions = {
      title: "Share " + this.state.product.name,
      url: this.state.product.images[0].src,
      message: this.state.product.permalink,
      subject: this.state.product.name,
    };
    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  _handleExternalProduct = () => {
    const isAvailable = InAppBrowser.isAvailable();
    if (isAvailable) {
      InAppBrowser.open(this.state.product.external_url, {
        // iOS Properties
        dismissButtonStyle: "cancel",
        preferredBarTintColor: "gray",
        preferredControlTintColor: "white",
        // Android Properties
        showTitle: true,
        toolbarColor: "#6200EE",
        secondaryToolbarColor: "black",
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: true,
      }).then(result => {
        //Toast.show(result);
      });
    } else {
      Linking.openURL(url);
    }
  };

  _increaseCounter = i => {
    const {variation, product} = this.state;
    let quantity = this.state.quantity;

    if (product.type == "grouped") {
      product.group[index].quantity++;
      console.log(quantity);
      console.log(product);
    }

    if (product.type == "variable") {
      if (!isEmpty(variation)) {
        if (variation.manage_stock == "parent") {
          if (product.manage_stock) {
            if (quantity < product.stock_quantity) {
              quantity++;
            } else {
              Toast.show("More items cannot be added");
            }
          } else {
            quantity++;
          }
        } else if (variation.manage_stock) {
          if (quantity < variation.stock_quantity) {
            quantity++;
          } else {
            Toast.show("More items cannot be added");
          }
        } else {
          quantity++;
        }
      } else {
        Toast.show("Select a variation first");
      }
    } else {
      console.log("def", product.manage_stock);
      if (product.manage_stock) {
        if (quantity < product.stock_quantity) {
          quantity++;
        } else {
          Toast.show("More items cannot be added");
        }
      } else {
        quantity++;
      }
    }

    this.setState({quantity});
  };

  _decreaseCounter = index => {
    const {quantity, product} = this.state;
    console.log(quantity);
    console.log(product);
    if (product.type == "grouped") {
      if (product.group[index].quantity > 0) {
        product.group[index].quantity--;
        this.setState({
          quantity: quantity - 1,
        });
      }
    } else if (quantity > 1) {
      this.setState({
        quantity: quantity - 1,
      });
    }
  };

  checkBox = i => () => {
    const {quantity, product, checked} = this.state;
    console.log(quantity);
    console.log(product);
    if (checked) {
      product.group[i].quantity--;
      this.setState({
        quantity: quantity - 1,
        checked: false,
      });
    } else {
      product.group[i].quantity++;
      this.setState({
        quantity: quantity + 1,
        checked: true,
      });
    }
  };

  gotoProductDetailPage = item => () => {
    console.log("kamal");
    this.props.navigation.push("ProductDetailScreen", item);
  };

  _handleAddToCart = (isBuyNow = false) => {
    const {product, quantity, variation, selectedAttrs} = this.state;
    let data = {id: this.state.product.id};

    switch (product.type) {
      case "grouped":
        if (
          product.group.every(element => {
            return element.quantity == 0;
          })
        ) {
          Toast.show("Select atleast one product");
          return;
        }
        data.quantity = {};
        for (let i in product.group) {
          if (product.group[i].quantity > 0) {
            data.quantity[product.group[i].id] = product.group[i].quantity;
          }
        }
        break;
      case "simple":
        data.quantity = quantity;
        break;
      case "variable":
        if (!isEmpty(variation)) {
          data.variation_id = variation.id;
          data.variation = selectedAttrs;
          data.quantity = quantity;
        } else {
          Toast.show("Select a variation first");
          return;
        }
    }

    if (this.props.appSettings.pincode_active) {
      if (this.state.postcode == "") {
        Toast.show("Please select a pincode first.");
        return;
      }
      if (isEmpty(this.state.deliverDetails)) {
        Toast.show("Please apply the pincode first.");
        return;
      }
      if (
        this.state.deliverDetails.hasOwnProperty("delivery") &&
        !this.state.deliverDetails.delivery
      ) {
        Toast.show("Delivery is not available for your location");
        return;
      }
    }

    ApiClient.post("/cart/add", data)
      .then(({data}) => {
        this.setState({
          cartMsg: Array.isArray(data) ? data.map(e => e.message).join(", ") : data.message,
        });
        if (this.isError(data)) {
          console.log("error");
        } else {
          this.props.getCartCount();
          if (isBuyNow) {
            this.props.navigation.navigate("Cart", this.state);
          } else {
            this.setState({modalVisible: true});
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  isError(data) {
    if (Array.isArray(data)) {
      return data.every(e => e.code === "0");
    } else {
      return data.code == 0;
    }
  }

  _closeModal = () => {
    this.setState({modalVisible: false});
  };

  closeModal = () => {
    this.setState({isOpenModal: false});
  };

  _submitEnquiry = () => {
    const {id} = this.props.user;
    const {qty, enquiry, phone, product, name, email} = this.state;
    if (qty == "" || enquiry == "" || phone == "" || name == "" || email == "") {
      Toast.show("Enter all the fields");
      return;
    }
    let param = {
      user_id: id,
      product_id: product.id,
      enquery: enquiry,
      mobile: phone,
      qty: qty,
    };
    console.log(param);
    this.setState({loading: true});
    ApiClient.post("/bulk-enqury", param)
      .then(({data}) => {
        this.setState({loading: false, isOpenModal: false});
        console.log(data);
        if (data.status) {
          Toast.show(data.message, Toast.LONG);
        }
      })
      .catch(error => {
        this.setState({loading: false});
        console.log(error);
      });
  };

  gotoReviews = product => () => {
    this.props.navigation.navigate("Reviews", product);
  };

  onVariationChange = item => option => {
    this.setState(
      prevState => ({
        selectedAttrs: {
          ...prevState.selectedAttrs,
          [item.slug]: option && option.slug ? option.slug : option,
        },
      }),
      () => {
        console.log(this.state.selectedAttrs);
        const {selectedAttrs, product, attributes} = this.state;
        if (Object.keys(selectedAttrs).length == attributes.length) {
          this.loadVariation({product_id: product.id, attributes: selectedAttrs});
        }
      },
    );
  };

  loadVariation(data) {
    console.log("Loading Variation");
    ApiClient.post("products/get-variation", data)
      .then(({data}) => {
        if (data.error) {
          this.setState({variation: {}});
          Toast.show("Currently This variation is not available. Select a different Variation");
        } else {
          this.setState({variation: data});
        }
      })
      .catch(err => {
        Toast.show("Something went wrong! Try later");
      });
  }

  submitPostcode = () => {
    let param = {
      pincode: this.state.postcode,
      product_id: this.state.product.id,
    };
    this.props.changeShippingPincode(this.state.postcode);
    this.setState({loading: true});
    ApiClient.post("/checkpincode/", param)
      .then(({data}) => {
        console.log(data);
        this.setState({loading: false, deliverDetails: data});
      })
      .catch(error => {
        this.setState({loading: false});
        console.log(error);
      });
  };

  changePostcode = () => {
    this.setState({deliverDetails: {}});
  };

  _renderItem = ({item, index}) => {
    return (
      <View
        key={item.id}
        style={{
          marginHorizontal: 16,
          marginTop: index > 0 ? 8 : 0,
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
        <Text>{item.name}</Text>
        {!item.sold_individually && item.type !== "variable" && (
          <View style={{flexDirection: "row"}}>
            <Button style={styles.btn} onPress={() => this._decreaseCounter(index)}>
              <Icon name="minus" type="Entypo" size={16} color="#757575" />
            </Button>
            <Text style={{paddingHorizontal: 8}}>{item.quantity}</Text>
            <Button style={styles.btn} onPress={() => this._increaseCounter(index)}>
              <Icon name="plus" type="Entypo" size={16} color="#757575" />
            </Button>
          </View>
        )}
        {item.sold_individually && item.type !== "variable" && (
          <Button onPress={this.checkBox(index)}>
            <Icon
              type="MaterialCommunityIcons"
              color={this.state.checked ? this.props.appSettings.primary_color : "#00000099"}
              size={24}
              name={this.state.checked ? "checkbox-marked" : "checkbox-blank-outline"}
            />
          </Button>
        )}
        {item.type === "variable" && (
          <Button onPress={this.gotoProductDetailPage(item)}>
            <Text style={{textDecorationLine: "underline"}}>Select Option</Text>
          </Button>
        )}
      </View>
    );
  };

  _keyExtractor = (index, item) => index + item;

  renderItemSlider = ({item, index}) => (
    <Image
      style={{width, height: width, resizeMode: "contain"}}
      source={{uri: item.banner_url || item.src}}
    />
  );

  keyExtractorSlider = item => item.id.toString();

  setIndex = index => () => {
    this.setState({index});
  };

  goToProductDetails = item => () => {
    navigation.navigate("ProductDetailScreen", item);
  };

  _renderFlatItem = ({item, index}) => {
    var discount = Math.ceil(((item.regular_price - item.price) / item.regular_price) * 100);
    const {accent_color, pincode_active} = this.props.appSettings;
    return (
      <TouchableWithoutFeedback onPress={this.goToProductDetails(item)}>
        <View style={{flexDirection: "column"}}>
          <View
            style={[
              {
                width: 170,
                backgroundColor: "#EAEAF1",
                paddingVertical: 20,
                borderRadius: 8,
                marginTop: 8,
                marginStart: 8,
                alignItems: "center",
              },
            ]}>
            {item.images.length > 0 && (
              <Image
                resizeMode="contain"
                style={{width: 150, height: 150}}
                source={{uri: item.images[0].src}}
                indicatorColor={accent_color}
              />
            )}

            {item.on_sale && (
              <View
                style={{
                  marginStart: 5,
                  marginTop: 5,
                  position: "absolute",
                  top: 0,
                  start: 0,
                  backgroundColor: accent_color,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text style={{fontSize: 10, color: "#fff", fontWeight: "600"}}>
                  {isFinite(discount) ? discount + "%" : "SALE"}
                </Text>
              </View>
            )}
            <WishlistIcon
              style={{
                position: "absolute",
                end: 0,
                top: 0,
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
                marginEnd: 4,
                marginTop: 4,
              }}
              item={item}
            />
          </View>
          <View style={{marginStart: 8}}>
            <Text
              style={[styles.itemMargin, {fontWeight: "600", fontSize: 12, width: 150}]}
              numberOfLines={1}>
              {item.name}
            </Text>
            <StarRating
              disabled
              maxStars={5}
              rating={parseInt(item.average_rating)}
              containerStyle={[styles.itemMargin, styles.star]}
              starStyle={{marginEnd: 5}}
              starSize={10}
              halfStarEnabled
              emptyStarColor={accent_color}
              fullStarColor={accent_color}
              halfStarColor={accent_color}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingEnd: 16,
                marginBottom: 8,
              }}>
              {item.price_html != "" && (
                <HTMLRender
                  html={item.price_html}
                  containerStyle={styles.itemMargin}
                  baseFontStyle={{fontSize: 12}}
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
      </TouchableWithoutFeedback>
    );
  };

  _keyExtractor = (item, index) => index + "sap" + item.id;

  render() {
    const {accent_color, pincode_active} = this.props.appSettings;
    const {t} = this.props;
    const {
      product,
      attributes,
      selectedAttrs,
      modalVisible,
      variation,
      postcode,
      deliverDetails,
      loading,
      index,
    } = this.state;
    return (
      <>
        <Container style={styles.container}>
          <Toolbar backButton title={product.name} cartButton wishListButton searchButton />
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <SwiperFlatList
              data={variation.image ? variation.image : product.images}
              nestedScrollEnabled={true}
              paginationActiveColor="red"
              showPagination={product.images.length > 1 ? true : false}
              paginationStyleItem={{
                width: 50,
                height: 50,
                marginHorizontal: 5,
              }}
              keyExtractor={this.keyExtractorSlider}
              renderItem={this.renderItemSlider}
              style={{width, height: width}}
            />
            <WishlistIcon style={[styles.right, {backgroundColor: "transparent"}]} item={product} />
            <Button
              style={{
                position: "absolute",
                top: 0,
                end: 0,
                marginTop: 20,
                marginEnd: 20,
              }}
              transparent
              onPress={this.share}>
              <Icon color={accent_color} name="md-share" size={24} />
            </Button>
            <View style={[styles.card, {marginTop: 0, paddingHorizontal: 16}]}>
              <Text style={{fontSize: 16, color: "#000000", fontWeight: "700"}}>
                {product.name.toUpperCase()}
              </Text>
              <Text style={{marginVertical: 4, fontSize: 12, color: "grey"}}>
                {"SKU:" + product.sku}
              </Text>
              <View style={[{flexDirection: "row", alignItems: "center"}]}>
                <StarRating
                  disabled
                  maxStars={5}
                  rating={parseInt(product.average_rating)}
                  containerStyle={{justifyContent: "flex-start"}}
                  starStyle={{marginEnd: 5}}
                  starSize={12}
                  halfStarEnabled
                  emptyStarColor={accent_color}
                  fullStarColor={accent_color}
                  halfStarColor={accent_color}
                />
                <Text>({product.rating_count || 0})</Text>
                <Button onPress={this.gotoReviews(product)}>
                  <Text> See all reviews</Text>
                </Button>
              </View>
              <View style={[styles.rowCenterSpaced]}>
                <HTMLRender
                  html={variation.price_html || product.price_html}
                  baseFontStyle={{fontSize: 16, fontWeight: "500"}}
                  containerStyle={{paddingTop: 8}}
                />

                {product.type != "grouped" && (
                  <QuantitySelector
                    minusClick={this._decreaseCounter}
                    plusClick={this._increaseCounter}
                    quantity={this.state.quantity}
                  />
                )}
              </View>
              <View style={[styles.rowCenterSpaced, {marginTop: 10}]}>
                <Text
                  style={[
                    (!isEmpty(variation) && variation.in_stock) || product.in_stock
                      ? {color: "green"}
                      : {color: "gray"},
                    {fontWeight: "600"},
                  ]}>
                  {product.in_stock ? "In stock" : "Out of stock"}
                </Text>
                <Button
                  style={{
                    backgroundColor: "#3F849E",
                    borderRadius: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                  onPress={() => this.setState({isOpenModal: true})}>
                  <Text style={{color: "#fff", fontSize: 12}}>Bulk Inquiry ?</Text>
                </Button>
              </View>

              {/* Footer Content */}
              {(product.purchasable ||
                (product.type === "external" && product.external_url) ||
                product.type === "grouped") && (
                <View style={{}}>
                  {product.type === "external" ? (
                    <Fragment>
                      <Button
                        onPress={this._handleExternalProduct}
                        style={[styles.footerButton, {backgroundColor: accent_color}]}>
                        <Text style={{color: "white"}}>Buy External Product</Text>
                      </Button>
                    </Fragment>
                  ) : (
                    ((!isEmpty(variation) && variation.in_stock) || product.in_stock) && (
                      <Fragment>
                        <Button
                          onPress={() => this._handleAddToCart(true)}
                          style={[
                            styles.footerButton,
                            {backgroundColor: accent_color, marginTop: 20},
                          ]}>
                          <Text style={{fontWeight: "600", color: "#fff"}}>Buy Now</Text>
                        </Button>
                        <Button
                          style={[styles.footerButton, {backgroundColor: "#F39248", marginTop: 10}]}
                          onPress={() => this._handleAddToCart(false)}>
                          <Text style={{color: "white", fontWeight: "600"}}>Add to Cart</Text>
                        </Button>
                      </Fragment>
                    )
                  )}

                  <View
                    style={{flexDirection: "row", justifyContent: "space-between", marginTop: 30}}>
                    <Button onPress={this.setIndex(0)}>
                      <Text style={{fontWeight: "600", color: index == 0 ? accent_color : "#000"}}>
                        Short{"\n"}Description
                      </Text>
                    </Button>
                    <Button onPress={this.setIndex(1)}>
                      <Text style={{fontWeight: "600", color: index == 1 ? accent_color : "#000"}}>
                        Description
                      </Text>
                    </Button>
                    <Button onPress={this.setIndex(2)}>
                      <Text style={{fontWeight: "600", color: index == 2 ? accent_color : "#000"}}>
                        Specification
                      </Text>
                    </Button>
                  </View>
                  {index == 0 ? (
                    <HTMLRender
                      html={product.short_description}
                      containerStyle={[styles.cardItem, {marginTop: 30}]}
                    />
                  ) : index == 1 ? (
                    <HTMLRender
                      html={product.description}
                      containerStyle={[styles.cardItem, {marginTop: 30}]}
                    />
                  ) : index == 2 ? (
                    <View style={[styles.cardItem, {marginTop: 30}]}>
                      <SpecificationRow
                        leftContent="Categories"
                        rightContent={product.categories.map(item => item.name).join(", ")}
                      />

                      {product.hasOwnProperty("total_sales") && (
                        <SpecificationRow
                          leftContent="Total Sales"
                          rightContent={product.total_sales}
                        />
                      )}

                      {product.hasOwnProperty("stock_quantity") && (
                        <SpecificationRow
                          leftContent="Stock Quantity"
                          rightContent={product.stock_quantity}
                        />
                      )}

                      {product.hasOwnProperty("sku") && product.sku != "" && (
                        <SpecificationRow leftContent="SKU" rightContent={product.sku} />
                      )}
                      {product.hasOwnProperty("weight") && product.weight != "" && (
                        <SpecificationRow
                          leftContent="Weight"
                          rightContent={product.stock_quantity}
                        />
                      )}

                      {product.attributes.map((item, index) => (
                        <SpecificationRow
                          leftContent={item.name}
                          rightContent={item.options
                            .map(opt => (opt.slug ? opt.name : opt))
                            .join(", ")}
                          key={item.name + index}
                        />
                      ))}
                    </View>
                  ) : (
                    ""
                  )}
                </View>
              )}
            </View>

            {product.variations.length > 0 && attributes.length > 0 && (
              <View style={[styles.card, {paddingBottom: 0, paddingHorizontal: 8}]}>
                <Text style={[styles.cardItemHeader, {paddingBottom: 8, paddingStart: 8}]}>
                  Variations
                </Text>
                <FlatGrid
                  items={attributes}
                  keyExtractor={this._keyExtractor}
                  renderItem={({item, index}) => {
                    console.log(index);
                    return (
                      <CustomPicker
                        options={item.options}
                        getLabel={option => (option && option.slug ? option.name : option)}
                        fieldTemplate={PickerField}
                        placeholder={item.name}
                        modalAnimationType="slide"
                        onValueChange={this.onVariationChange(item)}
                      />
                    );
                  }}
                  itemDimension={180}
                  spacing={8}
                  itemContainerStyle={{justifyContent: "flex-start"}}
                />
              </View>
            )}
            {product.group && product.group.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardItemHeader}>Group Products</Text>
                <FlatList
                  data={product.group}
                  renderItem={this._renderItem}
                  keyExtractor={this._keyExtractor}
                />
              </View>
            )}
            {pincode_active && (
              <View style={styles.card}>
                <Text style={styles.cardItemHeader}>{t("DELIVERY_OPTIONS")}</Text>
                {!deliverDetails.hasOwnProperty("delivery") ? (
                  <View
                    style={{
                      paddingHorizontal: 16,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <TextInput
                      placeholder={t("ENTER_POSTCODE")}
                      value={postcode}
                      onChangeText={text => this.setState({postcode: text})}
                    />
                    <Button
                      style={{
                        // backgroundColor: accent_color,
                        alignItems: "center",
                        justifyContent: "center",
                        height: 40,
                        paddingHorizontal: 10,
                      }}
                      onPress={this.submitPostcode}>
                      <Text style={{color: accent_color}}>Apply</Text>
                    </Button>
                  </View>
                ) : (
                  postcode != "" &&
                  deliverDetails.hasOwnProperty("delivery") && (
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        marginHorizontal: 16,
                      }}>
                      <Text>
                        Delivery {deliverDetails.delivery ? "" : "not"} available at -{" "}
                        <Text style={{fontWeight: "600"}}>{postcode}</Text>
                      </Text>
                      <Button onPress={this.changePostcode}>
                        <Text style={{color: accent_color}}>Change</Text>
                      </Button>
                    </View>
                  )
                )}

                {postcode != "" &&
                  deliverDetails.hasOwnProperty("delivery") &&
                  deliverDetails.delivery && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 16,
                        paddingTop: 16,
                        borderTopWidth: 1,
                        borderTopColor: "#d2d2d2",
                      }}>
                      <View style={styles.pincodeView}>
                        <Icon type="MaterialIcons" name="location-on" size={24} />
                        <Text style={{fontSize: 12, fontWeight: 600, marginTop: 8}}>LOCATION</Text>
                        <Text style={styles.pincodeText}>
                          {deliverDetails.city + "," + deliverDetails.state}
                        </Text>
                      </View>
                      <View style={styles.pincodeView}>
                        <Icon type="MaterialIcons" name="date-range" size={24} />
                        <Text style={{fontSize: 12, fontWeight: 600, marginTop: 8}}>
                          DELIVERY BY
                        </Text>
                        {deliverDetails.delivery_date != "" && (
                          <Text style={styles.pincodeText}>{deliverDetails.delivery_date}</Text>
                        )}
                      </View>
                      <View style={styles.pincodeView}>
                        <Icon name="ios-cash" size={24} />
                        <Text style={{fontSize: 12, fontWeight: 600, marginTop: 8}}>COD</Text>
                        <Text style={styles.pincodeText}>{deliverDetails.cod_message}</Text>
                      </View>
                    </View>
                  )}
              </View>
            )}

            {product.upsell && product.upsell.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardItemHeader}>Products you may like</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={product.upsell}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderFlatItem}
                  initialNumToRender={5}
                  nestedScrollEnabled={true}
                />
              </View>
            )}
            {product.related && product.related.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardItemHeader}>Related Products</Text>
                {/* <ProductsRow keyPrefix="product" products={product.related} /> */}
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={product.related}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderFlatItem}
                  initialNumToRender={5}
                  nestedScrollEnabled={true}
                />
              </View>
            )}
            {loading && <ActivityIndicator style={{flex: 1}} />}
          </ScrollView>
        </Container>
        <Modal
          isVisible={modalVisible}
          onBackButtonPress={this._closeModal}
          hasBackdrop
          backdropOpacity={0.3}
          useNativeDriver
          hideModalContentWhileAnimating
          style={{marginHorizontal: 0, marginBottom: 0, justifyContent: "flex-end"}}>
          <MiniCart data={this.state} close={this._closeModal} message={this.state.cartMsg} />
        </Modal>
        <Modal
          backdropOpacity={0.5}
          isVisible={this.state.isOpenModal}
          style={{margin: 0}}
          onBackButtonPress={this.closeModal}
          useNativeDriver
          hideModalContentWhileAnimating>
          <View
            style={{
              backgroundColor: "#FFF",
              paddingVertical: 10,
              marginHorizontal: 16,
              marginVertical: 16,
              paddingHorizontal: 16,
              borderRadius: 8,
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                paddingBottom: 8,
                marginVertical: 16,
              }}>
              <Text style={{fontWeight: "600", fontSize: 14}}>Bulk Enquiry</Text>
              <Button onPress={this.closeModal}>
                <Icon name="cross" type="Entypo" size={24} color="#757575" />
              </Button>
            </View>
            <View style={styles.view}>
              <Text style={styles.txt}>Name*</Text>
              <TextInput
                style={styles.textinput}
                value={this.state.name}
                onChangeText={this.onchangename}
              />
            </View>
            <View style={styles.view}>
              <Text style={[styles.txt, {width: 52}]}>Email*</Text>
              <TextInput
                style={styles.textinput}
                value={this.state.email}
                onChangeText={this.onchangeemail}
              />
            </View>
            <View style={styles.view}>
              <Text style={[styles.txt, {width: 58}]}>Phone*</Text>
              <TextInput
                style={styles.textinput}
                value={this.state.phone}
                onChangeText={this.onchangephone}
              />
            </View>
            <View style={styles.view}>
              <Text style={[styles.txt, {width: 74}]}>Qunatity*</Text>
              <TextInput
                style={styles.textinput}
                value={this.state.qty}
                onChangeText={this.onchangequantity}
              />
            </View>
            <View style={styles.view}>
              <Text style={[styles.txt, {width: 102}]}>Your Enquiry*</Text>
              <TextInput
                style={styles.textinput}
                value={this.state.enquiry}
                onChangeText={this.onchangeenquiry}
              />
            </View>
            <Button
              style={{
                backgroundColor: accent_color,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
                paddingVertical: 8,
                marginVertical: 12,
              }}
              onPress={this._submitEnquiry}>
              <Text style={{fontWeight: "600", color: "#fff"}}>Submit</Text>
            </Button>
          </View>
        </Modal>
      </>
    );
  }
}

// const mapDispatchToProps = {
//   getCartCount,
// };

function PickerField({selectedItem, defaultText, getLabel, clear}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: 30,
        backgroundColor: "#efefef",
        alignItems: "center",
        padding: 8,
        borderRadius: 4,
      }}>
      <Text style={{color: selectedItem ? selectedItem.color : "gray"}}>
        {selectedItem ? getLabel(selectedItem) : defaultText}
      </Text>
      <Icon name="ios-arrow-down" size={20} color="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  footer: {
    width: "100%",
    flexDirection: "row",
  },
  footerButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    borderRadius: 4,
  },
  rowCenterSpaced: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    marginTop: 10,
  },
  cardItemHeader: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "700",
    padding: 16,
    paddingTop: 0,
  },
  cardItem: {
    // paddingHorizontal: 16,
  },
  pincodeView: {
    flex: 1,
    alignItems: "center",
  },
  pincodeText: {
    //fontWeight: "500",
    textAlign: "center",
    fontSize: 12,
  },
  btn: {
    borderWidth: 1,
    borderColor: "#dedede",
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
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
    start: 0,
    top: 0,
    marginTop: 20,
    marginStart: 20,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  txt: {
    backgroundColor: "#fff",
    width: 56,
    marginStart: 5,
    paddingHorizontal: 4,
    marginTop: -10,
  },
  view: {
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 20,
  },
  textinput: {paddingVertical: 4, paddingStart: 8},
});

const mapStateToProps = state => ({
  appSettings: state.appSettings,
  shipping: state.shipping,
  user: state.user,
});
const mapDispatchToProps = {
  getCartCount,
  changeShippingPincode,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(ProductDetailScreen));
