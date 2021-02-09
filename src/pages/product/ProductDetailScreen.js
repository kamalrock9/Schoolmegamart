import React, {Component, Fragment} from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  FlatList,
  Linking,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
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
  ProgressDialog,
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
import analytics from "@react-native-firebase/analytics";
import {SvgCart} from "../../assets/svgs";

const {width} = Dimensions.get("window");
const aspectHeight = (nWidth, oHeight, oWidth) => (nWidth * oHeight) / oWidth;
class ProductDetailScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    this.state = {
      quantity: 1,
      product: !!props.navigation.state.params.itemByProduct
        ? {}
        : !!this.props.navigation.state.params.itemByURL
        ? {}
        : props.navigation.state.params,
      BundleQty: [],
      BundleCheckBox: [],
      cartMsg: "",
      modalVisible: false,
      attributes: [],
      selectedAttrs: {},
      variation: {},
      postcode: props.shipping.postcode || "",
      deliverDetails: {},
      loading: true,
      checked: false,
      index: 0,
      isOpenModal: false,
      name: "",
      email: "",
      phone: "",
      qty: "",
      enquiry: "",
      scroll: true,
    };
  }
  componentDidMount() {
    this.trackScreenView("Product Details Screen");
    if (!!this.props.navigation.state.params.itemByURL) {
      this.handleOpenURL(this.props.navigation.state.params.itemByURL);
    } else if (!!this.props.navigation.state.params.itemByProduct) {
      this.setState({loading: true});
      ApiClient.get("/get-products-by-id?id=" + this.props.navigation.state.params.itemByProduct.id)
        .then(({data}) => {
          ////console.log(data);
          // let newData = Object.assign(data,{
          //    quantity:1
          // });
          if (data.status) {
            var newData = data.bundled_items.map(function(el) {
              var o = Object.assign({}, el);
              o.quantity = 1;
              o.checkbox = true;
              return o;
            });
            var newD = {...data, bundled_items: newData};
            //console.log(newD);
            this.setState({product: newD, loading: false}, () => {
              this.setUpProduct();
            });
          }
          this.setState({loading: false});
        })
        .catch(error => {
          //console.log(error);
          this.setState({loading: false});
        });
    } else {
      this.setState({loading: false});
      this.setUpProduct();
    }
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  handleOpenURL(url) {
    ApiClient.get("/get-product-by-url?url=" + url)
      .then(({data}) => {
        this.setState({product: data});
        this.setState({loading: false});
        this.setUpProduct();
      })
      .catch(error => {
        console.log(error);
      });
  }

  setUpProduct() {
    const {product, postcode} = this.state;
    let attributes = [];
    for (let attr of product.attributes) {
      if (attr.variation && attr.visible) {
        attributes.push(attr);
      }
    }
    this.setState({attributes});
    //console.log(attributes);
    this.setup();
    console.log(postcode);
    if (postcode !== "") {
      this.submitPostcode();
    }
    if (!product.in_stock) {
      Toast.show("More items can not be added", Toast.SHORT);
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
          //console.log(newData);
          this.setState(prevState => ({
            product: {...prevState.product, group: newData},
          }));
        })
        .catch(error => {});
    }
  };

  share = base64image => {
    let shareOptions = {
      title: "Share " + this.state.product.name,
      //  url: this.state.product.images[0].src,
      message: this.state.product.permalink,
      subject: this.state.product.name,
    };
    Share.open(shareOptions)
      .then(res => {
        //console.log(res);
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
    } else if (product.type == "bundle") {
      if (product.manage_stock) {
        if (quantity < product.stock_quantity) {
          quantity++;
        } else {
          Toast.show("More items cannot be added");
        }
      } else {
        quantity++;
      }
    } else {
      //console.log("def", product.manage_stock);
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

  _BundleincreaseCounter = (item, index) => () => {
    const {product} = this.state;
    if (
      product.bundled_items[index].quantity + 1 >
      product.bundled_items[index].product_details.stock_quantity
    ) {
      Toast.show("More items cannot be added");
      return;
    }

    this.setState(
      prevState => {
        prevState.product.bundled_items[index].quantity++;
        return {product: prevState.product};
      },
      () => {
        this.forceUpdate();
      },
    );
  };

  _BundledecreaseCounter = (item, index) => () => {
    const {product} = this.state;
    //console.log(product.bundled_items[index].quantity);
    if (product.bundled_items[index].quantity < 1) {
      Toast.show("Quantity can't below 0.", Toast.SHORT);
      return;
    }
    this.setState(
      prevState => {
        prevState.product.bundled_items[index].quantity--;
        return {product: prevState.product};
      },
      () => {
        this.forceUpdate();
      },
    );
  };

  changeCheckbox = (item, index) => () => {
    const {product} = this.state;
    for (let i = 0; i < product.bundled_items.length; i++) {
      if (product.bundled_items[index].checkbox) {
        product.bundled_items[index].checkbox = false;
      } else {
        product.bundled_items[index].checkbox = true;
      }
    }
    //console.log(product);
    this.setState({product: product}, () => {
      this.forceUpdate();
    });
  };

  _decreaseCounter = index => {
    const {quantity, product} = this.state;
    //console.log(quantity);
    //console.log(product);
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
    //console.log(quantity);
    //console.log(product);
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
    //console.log("kamal");
    this.props.navigation.push("ProductDetailScreen", item);
  };

  _handleAddToCart = (isBuyNow = false) => {
    const {product, quantity, variation, selectedAttrs} = this.state;
    let data = {id: this.state.product.id, quantity: this.state.quantity};

    switch (product.type) {
      case "bundle":
        if (
          product.bundled_items.every(element => {
            return element.checkbox == false;
          })
        ) {
          Toast.show("Select atleast one product", Toast.SHORT);
          return;
        }
        if (
          product.bundled_items.every(element => {
            return element.quantity == 0;
          })
        ) {
          Toast.show("Select atleast 1 qunatity of any product", Toast.SHORT);
          return;
        }
        data.bundle_items = {};
        for (let i in product.bundled_items) {
          if (product.bundled_items[i].checkbox) {
            data.bundle_items[product.bundled_items[i].bundled_item_id] = Object.assign(
              {},
              {
                product_id: product.bundled_items[i].product_id,
                quantity: product.bundled_items[i].quantity,
              },
            );
          }
        }
        break;
      case "grouped":
        if (
          product.group.every(element => {
            return element.quantity == 0;
          })
        ) {
          Toast.show("Select atleast one product", Toast.SHORT);
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
          Toast.show("Select a variation first", Toast.SHORT);
          return;
        }
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
    this.setState({loading: true});
    ApiClient.post("/cart/add", data)
      .then(({data}) => {
        this.setState({loading: false});

        this.setState({
          cartMsg: Array.isArray(data) ? data.map(e => e.message).join(", ") : data.message,
        });
        if (this.isError(data)) {
          //console.log("error");
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
        this.setState({loading: true});
        //console.log(error);
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
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const verifyMob = /^[0]?[6789]\d{9}$/;
    if (qty == "" || enquiry == "" || phone == "" || name == "" || email == "") {
      Toast.show("Enter all the fields", Toast.SHORT);
      return;
    }
    if (reg.test(email) === false) {
      Toast.show("Enter the correct email address.", Toast.SHORT);
      return;
    }
    if (verifyMob.test(phone) === false && phone.length != 10) {
      Toast.show("Enter the correct Phone Number.", Toast.SHORT);
      return;
    }
    let param = {
      customer_email: email,
      customer_name: name,
      product_id: product.id,
      enquery: enquiry,
      mobile: phone,
      qty: qty,
    };
    if (!isEmpty(this.props.user)) {
      param.user_id = id;
    }
    // console.log(JSON.stringify(param));
    this.setState({loading: true});
    ApiClient.post("/bulk-enqury", param)
      .then(({data}) => {
        this.setState({loading: false, isOpenModal: false});
        //console.log(data);
        if (data.status) {
          Toast.show(data.message, Toast.SHORT);
        }
      })
      .catch(error => {
        this.setState({loading: false});
        //console.log(error);
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
        // console.log(this.state.selectedAttrs);
        const {selectedAttrs, product, attributes} = this.state;
        if (Object.keys(selectedAttrs).length == attributes.length) {
          this.loadVariation({product_id: product.id, attributes: selectedAttrs});
        }
      },
    );
  };

  loadVariation(data) {
    // console.log("Loading Variation");
    // console.log(JSON.stringify(data));
    // console.log(this.state.product);
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
    console.log(param);
    //this.setState({loading: true});
    // ApiClient.post("/checkpincode/", param)
    //   .then(({data}) => {
    //     //console.log(data);
    //     this.setState({loading: false, deliverDetails: data});
    //   })
    //   .catch(error => {
    //     this.setState({loading: false});
    //     //console.log(error);
    //   });
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

  //   gotoZoom= (images)=>{
  //     <ImageZoom cropWidth={Dimensions.get('window').width}
  //     cropHeight={Dimensions.get('window').height}
  //     imageWidth={200}
  //     imageHeight={200}>
  //      { images.map((item,index)=>{
  //         return(
  // <Image style={{width:200, height:200}}
  //     source={{uri:'http://v1.qzone.cc/avatar/201407/07/00/24/53b9782c444ca987.jpg!200x200.jpg'}}/>
  //         )
  //       })}
  // </ImageZoom>
  //   }

  renderItemSlider = ({item, index}) => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate("SliderImageZoom", this.state.product.images)}>
      <Image
        style={{width, height: width, resizeMode: "contain"}}
        source={{uri: item.banner_url || item.src}}
      />
    </TouchableOpacity>
  );

  keyExtractorSlider = item => item.id.toString();

  setIndex = index => () => {
    this.setState({index});
  };

  goToProductDetails = item => () => {
    //console.log(item);
    this.props.navigation.push("ProductDetailScreen", item);
  };

  _addToCart = product => () => {
    console.log(product);
    let data = {id: product.id, quantity: 1};

    if (product.in_stock == false) {
      Toast.show("Product is out of stock.", Toast.SHORT);
      return;
    }

    switch (product.type) {
      case "simple":
        data.quantity = 1;
        break;
      default:
        this.props.navigation.navigate("ProductDetailScreen", {item: product});
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
      })
      .catch(error => {
        this.setState({loading: true});
        //console.log(error);
      });
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
                //  backgroundColor: "#EAEAF1",
                paddingVertical: 20,
                borderRadius: 8,
                marginTop: 8,
                marginStart: index == 0 ? 16 : 8,
                alignItems: "center",
                borderColor: "#f8f8fa",
                borderWidth: 4,
              },
            ]}>
            {item.images.length > 0 && (
              <Image
                resizeMode="contain"
                style={{width: width/3, height: 150}}
                source={{uri: item.images[0].src}}
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
                  backgroundColor: accent_color,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text style={{fontSize: 10, color: "#fff", fontWeight: "600"}}>
                  {isFinite(discount)
                    ? Math.round((discount + Number.EPSILON) * 10) / 10 + "%"
                    : " (SALE)"}
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
                borderRadius: 4,
                alignItems: "center",
                justifyContent: "center",
                marginEnd: 2,
                marginTop: 2,
                backgroundColor: "#f8f8fa",
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
              starSize={14}
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
                  baseFontStyle={{fontSize: 12, fontWeight: "700"}}
                />
              )}
              <Button onPress={this._addToCart(item)}>
                <Icon name="handbag" type="SimpleLineIcons" size={24} />
              </Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _attributesRenderItem = ({item, index}) => {
    return (
      <CustomPicker
        containerStyle={{marginTop: index > 0 ? 16 : 0}}
        options={item.options}
        getLabel={option => (option && option.slug ? option.name : option)}
        fieldTemplate={PickerField}
        placeholder={item.name}
        modalAnimationType="slide"
        onValueChange={this.onVariationChange(item)}
      />
    );
  };

  _keyExtractorAttri = (item, index) => index + "sap" + item.id;

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
    const gotoSum = item => {
      let value = 0;
      for (let i = 0; i < item.length; i++) {
        value += item[i].checkbox ? Number(item[i].product_details.price) * item[i].quantity : 0;
      }
      return value;
    };
    var discount = Math.round(
      ((product.regular_price - product.price) / product.regular_price) * 100,
      2,
    );

    return loading ? (
      <ProgressDialog loading={loading} />
    ) : !loading && isEmpty(product) ? (
      <>
        <Toolbar backButton title={"Prdouct Details Screen"} />
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Text style={{fontWeight: "600", fontSize: 14}}>Product Not Found...</Text>
        </View>
      </>
    ) : (
      <>
        <Container style={styles.container}>
          <Toolbar backButton title={""} cartButton wishListButton searchButton />
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {variation != "" && variation.hasOwnProperty("image") ? (
              <Image
                style={{width, height: width, resizeMode: "contain"}}
                source={{uri: variation.image.src}}
              />
            ) : (
              <SwiperFlatList
                data={product.images}
                nestedScrollEnabled={true}
                paginationActiveColor="red"
                showPagination={product.images.length > 1}
                paginationStyleItem={{
                  width: 50,
                  height: 50,
                  marginHorizontal: 5,
                }}
                keyExtractor={this.keyExtractorSlider}
                renderItem={this.renderItemSlider}
                style={{width, height: width}}
              />
            )}
            <WishlistIcon style={[styles.right, {backgroundColor: "transparent"}]} item={product} />
            <Button
              style={{
                marginHorizontal: 8,
                position: "absolute",
                end: 0,
                top: 0,
                marginEnd: 20,
                marginTop: 20,
              }}
              transparent
              onPress={this.share}>
              <Icon color={accent_color} name="md-share" size={24} />
            </Button>
            <View style={[styles.card, {marginTop: 0, paddingVertical: 16}]}>
              <Text
                style={{
                  fontSize: 16,
                  color: "#000000",
                  fontWeight: "500",
                  paddingHorizontal: 16,
                  marginEnd: 16,
                  flex: 10,
                }}>
                {product.name.toUpperCase()}
              </Text>

              {/* <Text style={{marginVertical: 4, fontSize: 12, color: "grey", paddingHorizontal: 16}}>
                {product.sku}
              </Text> */}
              <View style={[{flexDirection: "row", alignItems: "center", paddingHorizontal: 16}]}>
                <Button
                  onPress={this.gotoReviews(product)}
                  style={{flexDirection: "row", alignItems: "center"}}>
                  <StarRating
                    disabled
                    maxStars={5}
                    rating={parseInt(product.average_rating)}
                    containerStyle={{justifyContent: "flex-start"}}
                    starStyle={{marginEnd: 5}}
                    starSize={14}
                    halfStarEnabled
                    emptyStarColor={accent_color}
                    fullStarColor={accent_color}
                    halfStarColor={accent_color}
                  />
                  <Text>({product.rating_count || 0})</Text>
                  <Text> See all reviews</Text>
                </Button>
              </View>
              <View style={[styles.rowCenterSpaced, {paddingHorizontal: 16}]}>
                {product.type != "bundle" ? (
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <HTMLRender
                      html={variation.price_html || product.price_html}
                      baseFontStyle={{fontSize: 16, fontWeight: "500"}}
                      containerStyle={{paddingTop: 8}}
                    />
                    {product.on_sale && (
                      // <View
                      //   style={{
                      //     marginStart: 5,
                      //     marginTop: 20,
                      //     position: "absolute",
                      //     top: 0,
                      //     end: 0,
                      //     marginEnd: 20,
                      //     backgroundColor: accent_color,
                      //     width: 35,
                      //     height: 35,
                      //     borderRadius: 18,
                      //     alignItems: "center",
                      //     justifyContent: "center",
                      //   }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: accent_color,
                          fontWeight: "700",
                          paddingTop: 8,
                          //position: "absolute",
                        }}>
                        {isFinite(discount)
                          ? "(-" + Math.round((discount + Number.EPSILON) * 10) / 10 + "%)"
                          : " (SALE)"}
                      </Text>
                      // </View>
                    )}
                  </View>
                ) : (
                  <View style={{flexDirection: "row"}}>
                    <HTMLRender
                      html={" " + product.currency_symbol}
                      containerStyle={{}}
                      baseFontStyle={{fontSize: 16, fontWeight: "500"}}
                    />
                    <Text style={{fontSize: 16, fontWeight: "500"}}>
                      {gotoSum(product.bundled_items)}
                    </Text>
                    {product.on_sale && (
                      // <View
                      //   style={{
                      //     marginStart: 5,
                      //     marginTop: 20,
                      //     position: "absolute",
                      //     top: 0,
                      //     end: 0,
                      //     marginEnd: 20,
                      //     backgroundColor: accent_color,
                      //     width: 35,
                      //     height: 35,
                      //     borderRadius: 18,
                      //     alignItems: "center",
                      //     justifyContent: "center",
                      //   }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: accent_color,
                          fontWeight: "700",
                          paddingTop: 8,
                          //position: "absolute",
                        }}>
                        {isFinite(discount)
                          ? "(-" + Math.round((discount + Number.EPSILON) * 10) / 10 + "%)"
                          : " (SALE)"}
                      </Text>
                      // </View>
                    )}
                  </View>
                )}

                {product.type != "grouped" && (
                  <QuantitySelector
                    minusClick={this._decreaseCounter}
                    plusClick={this._increaseCounter}
                    quantity={this.state.quantity}
                  />
                )}
              </View>
              <View style={[styles.rowCenterSpaced, {marginTop: 10, paddingHorizontal: 16}]}>
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
                    backgroundColor: accent_color,
                    borderRadius: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                  onPress={() => this.setState({isOpenModal: true})}>
                  <Text style={{fontWeight: "600", color: "white"}}>Bulk Enquiry?</Text>
                  {/* <Image
                    resizeMode="contain"
                    source={{width: "100%", height: aspectHeight((width - 40) / 2 - 9, 124, 36)}}
                    source={require("../../assets/imgs/bulk_enquiry.png")}
                  /> */}
                </Button>
              </View>
              {product.type === "bundle" &&
                product.bundled_items.map((item, index) => {
                  const {product_details} = item;
                  return (
                    <View
                      key={item.id + "Sap" + index}
                      style={{flexDirection: "row", marginTop: 16, paddingHorizontal: 16}}>
                      <Image
                        style={{height: 70, width: 70, borderRadius: 4, marginEnd: 8}}
                        source={{
                          uri: product_details.image_id
                            ? product_details.image_id
                            : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
                        }}
                      />
                      <View>
                        <Text
                          style={{
                            fontSize: 16,
                            marginTop: -4,
                            color: "#000000",
                            fontWeight: "500",
                          }}>
                          {product_details.name}
                        </Text>
                        {/* <Text style={{fontSize: 12, color: "grey"}}>{product_details.sku}</Text> */}
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                          <TouchableOpacity style={{}} onPress={this.changeCheckbox(item, index)}>
                            <Icon
                              type="MaterialCommunityIcons"
                              color={
                                item.checkbox ? this.props.appSettings.accent_color : "#000000"
                              }
                              size={24}
                              name={item.checkbox ? "checkbox-marked" : "checkbox-blank-outline"}
                            />
                          </TouchableOpacity>
                          <View style={{flexDirection: "row"}}>
                            <Text>Add for</Text>
                            <HTMLRender
                              html={" " + product.currency_symbol}
                              containerStyle={{}}
                              baseFontStyle={{fontSize: 14, fontWeight: "700"}}
                            />
                            <Text style={{fontWeight: "700"}}>{product_details.price} each</Text>
                          </View>
                        </View>
                        {item.checkbox && (
                          <View>
                            <Text>
                              Status:
                              <Text style={{color: "green", fontWeight: "600"}}>
                                {" " + product_details.stock_quantity} in Stock
                              </Text>
                            </Text>
                            <View style={{alignItems: "flex-start"}}>
                              <QuantitySelector
                                minusClick={this._BundledecreaseCounter(item, index)}
                                plusClick={this._BundleincreaseCounter(item, index)}
                                quantity={item.quantity}
                              />
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              {product.hasOwnProperty("product_origin") && product.product_origin != "" && (
                <View style={[styles.rowCenterSpaced, {marginTop: 10, paddingHorizontal: 16}]}>
                  <Text style={{fontWeight: "600"}}>Location</Text>
                  <Text>{product.product_origin}</Text>
                </View>
              )}

              <View style={{backgroundColor: "#f5f5f5", height: 8, marginTop: 10}} />
              {product.variations.length > 0 && attributes.length > 0 && (
                <View style={[styles.card, {paddingBottom: 0, marginTop: 0}]}>
                  <Text style={[styles.cardItemHeader, {paddingBottom: 8, paddingHorizontal: 16}]}>
                    Variations
                  </Text>
                  <FlatList
                    data={attributes}
                    keyExtractor={this._keyExtractorAttri}
                    renderItem={this._attributesRenderItem}
                    itemDimension={180}
                    spacing={8}
                    contentContainerStyle={{
                      justifyContent: "flex-start",
                      width: width - 32,
                      marginStart: 16,
                    }}
                  />
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 30,
                  paddingHorizontal: 16,
                }}>
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
                  html={product.short_description ? product.short_description : "<b />"}
                  containerStyle={[styles.cardItem, {marginTop: 30}]}
                />
              ) : index == 1 ? (
                <HTMLRender
                  html={product.description ? product.description : "<b />"}
                  containerStyle={[styles.cardItem, {marginTop: 30}]}
                />
              ) : index == 2 ? (
                <View style={[styles.cardItem, {marginTop: 30}]}>
                  {/* <SpecificationRow
                        leftContent="Categories"
                        rightContent={product.categories.map(item => item.name).join(", ")}
                      /> */}

                  {/* {product.hasOwnProperty("total_sales") && (
                        <SpecificationRow
                          leftContent="Total Sales"
                          rightContent={product.total_sales}
                        />
                      )} */}

                  {/* {product.hasOwnProperty("stock_quantity") && (
                        <SpecificationRow
                          leftContent="Stock Quantity"
                          rightContent={product.stock_quantity}
                        />
                      )} */}

                  {/* {product.hasOwnProperty("sku") && product.sku != "" && (
                        <SpecificationRow leftContent="SKU" rightContent={product.sku} />
                      )} */}
                  {product.hasOwnProperty("weight") && product.weight != "" && (
                    <SpecificationRow leftContent="Weight" rightContent={product.weight + " kg"} />
                  )}

                  {product.hasOwnProperty("attributes_specification") &&
                    !isEmpty(product.attributes_specification) &&
                    product.attributes_specification.map((item, index) => (
                      <SpecificationRow
                        leftContent={item.name}
                        rightContent={item.value}
                        // rightContent={item.options
                        //   .map(opt => (opt.slug ? opt.name : opt))
                        //   .join(", ")}
                        key={item.name + index}
                      />
                    ))}
                </View>
              ) : (
                <View />
              )}
            </View>

            {product.group && product.group.length > 0 && (
              <View style={[styles.card, {paddingHorizontal: 16}]}>
                <Text style={styles.cardItemHeader}>Group Products</Text>
                <FlatList
                  data={product.group}
                  renderItem={this._renderItem}
                  keyExtractor={this._keyExtractor}
                />
              </View>
            )}
            {pincode_active && (
              <View style={[styles.card, {paddingHorizontal: 16}]}>
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
              <View style={[styles.card, {paddingHorizontal: 16}]}>
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
              <View style={[styles.card, {}]}>
                <Text style={styles.cardItemHeader}>Related Products</Text>
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
          {/* Footer Content */}
          {(product.purchasable ||
            (product.type === "external" && product.external_url) ||
            product.type === "grouped") && (
            <View style={{paddingHorizontal: 16, width: "100%", flexDirection: "row"}}>
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
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                      alignItems: "center",
                    }}>
                    {product.type != "bundle" ? (
                      <HTMLRender
                        html={variation.price_html || product.price_html}
                        baseFontStyle={{fontSize: 14, fontWeight: "500", flex: 1}}
                      />
                    ) : (
                      <View style={{flexDirection: "row"}}>
                        <HTMLRender
                          html={" " + product.currency_symbol}
                          containerStyle={{}}
                          baseFontStyle={{fontSize: 16, fontWeight: "500"}}
                        />
                        <Text style={{fontSize: 16, fontWeight: "500"}}>
                          {gotoSum(product.bundled_items)}
                        </Text>
                      </View>
                    )}
                    <View style={{flexDirection: "row"}}>
                      <Button
                        style={[styles.footerButton, {backgroundColor: "#F39248", marginEnd: 8}]}
                        onPress={() => this._handleAddToCart(false)}>
                        <SvgCart style={styles.drawerItemIcon} width={20} height={20} />
                      </Button>
                      <Button
                        onPress={() => this._handleAddToCart(true)}
                        style={[
                          styles.footerButton,
                          {backgroundColor: accent_color, paddingHorizontal: 24},
                        ]}>
                        <Text style={{fontWeight: "600", color: "#fff"}}>Buy Now</Text>
                      </Button>
                    </View>
                  </View>
                )
              )}
            </View>
          )}
        </Container>
        <ProgressDialog loading={loading} />
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
                keyboardType="numeric"
                style={styles.textinput}
                value={this.state.phone}
                onChangeText={this.onchangephone}
              />
            </View>
            <View style={styles.view}>
              <Text style={[styles.txt, {width: 74}]}>Qunatity*</Text>
              <TextInput
                keyboardType="numeric"
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
    flexDirection: "row",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderRadius: 8,
    marginVertical: 8,
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
    paddingHorizontal: 16,
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
  drawerItemIcon: {
    marginHorizontal: 20,
    color: "#ffffff",
    fontWeight: "900",
  },
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
