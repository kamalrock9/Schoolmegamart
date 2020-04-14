import React, {Component, Fragment} from "react";
import {View, StyleSheet, ScrollView} from "react-native";
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
} from "components";
import {CustomPicker} from "react-native-custom-picker";
import SpecificationRow from "./SpecificationRow";
import MiniCart from "./MiniCart";
import ProductsRow from "./ProductsRow";
import {ApiClient} from "service";
import {getCartCount} from "store/actions";
import {FlatGrid} from "react-native-super-grid";
import Toast from "react-native-simple-toast";

class ProductDetailScreen extends Component {
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
    };
  }
  componentDidMount() {
    const {product} = this.state;
    let attributes = [];
    for (let attr of product.attributes) {
      if (attr.variation && attr.visible) {
        attributes.push(attr);
      }
    }
    this.setState({attributes});
    console.log(attributes);
    this.setup();
  }
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
  };

  shareProduct = () => {
    RNFetchBlob.fetch("GET", this.state.product.images[0].src)
      .then(resp => {
        console.log("response : ", resp);
        let base64image = resp.data;
        this.share("data:image/png;base64," + base64image);
      })
      .catch(err => console.log(err));
  };

  share = base64image => {
    let shareOptions = {
      title: "Share " + this.state.product.name,
      url: base64image,
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

  _increaseCounter = () => {
    const {variation, product} = this.state;
    let quantity = this.state.quantity;

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
      if (product.manage_stock) {
        if (quantity < product.stock_quantity) {
          this.product.quantity++;
        } else {
          Toast.show("More items cannot be added");
        }
      } else {
        this.product.quantity++;
      }
    }

    this.setState({quantity});
  };

  _decreaseCounter = () => {
    if (this.state.quantity > 1) {
      this.setState({
        quantity: this.state.quantity - 1,
      });
    }
  };

  _handleAddToCart = (isBuyNow = false) => {
    const {product, quantity, variation, selectedAttrs} = this.state;
    let data = {id: this.state.product.id};

    switch (product.type) {
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

  onVariationChange = item => async option => {
    await this.setState(prevState => ({
      selectedAttrs: {
        ...prevState.selectedAttrs,
        [item.slug]: option && option.slug ? option.slug : option,
      },
    }));

    console.log(this.state.selectedAttrs);
    const {selectedAttrs, product, attributes} = this.state;
    if (Object.keys(selectedAttrs).length == attributes.length) {
      this.loadVariation({product_id: product.id, attributes: selectedAttrs});
    }
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

  render() {
    const {accent_color} = this.props.appSettings;
    const {product, attributes, selectedAttrs, modalVisible, variation} = this.state;
    return (
      <>
        <Container style={styles.container}>
          <Toolbar backButton title={product.name} cartButton />
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View>
              <Slider
                data={
                  variation.image
                    ? unionBy([variation.image], product.images, x => x.id)
                    : product.images
                }
              />
            </View>
            <View style={[styles.card, {marginTop: 0}]}>
              <View style={[styles.rowCenterSpaced, styles.cardItem]}>
                <Text style={{fontSize: 16, color: "#000000", fontWeight: "700"}}>
                  {product.name}
                </Text>
                <Button transparent onPress={this.shareProduct}>
                  <Icon name="md-share" size={24} />
                </Button>
              </View>

              {product.short_description != "" && (
                <HTMLRender html={product.short_description} containerStyle={styles.cardItem} />
              )}

              <View style={[styles.rowCenterSpaced, styles.cardItem]}>
                <HTMLRender
                  html={variation.price_html || product.price_html}
                  baseFontStyle={{fontSize: 16, fontWeight: "500"}}
                  containerStyle={{paddingTop: 8}}
                />
                <Text
                  style={
                    (!isEmpty(variation) && variation.in_stock) || product.in_stock
                      ? {color: "green"}
                      : {color: "gray"}
                  }>
                  {product.in_stock ? "In stock" : "Out of stock"}
                </Text>
              </View>

              <View style={[styles.rowCenterSpaced, styles.cardItem]}>
                <Text>Quantity</Text>
                <QuantitySelector
                  minusClick={this._decreaseCounter}
                  plusClick={this._increaseCounter}
                  quantity={this.state.quantity}
                />
              </View>
            </View>
            <View
              style={[styles.card, styles.cardItem, {flexDirection: "row", alignItems: "center"}]}>
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
            </View>
            {product.variations.length > 0 && attributes.length > 0 && (
              <View style={[styles.card, {paddingBottom: 0, paddingHorizontal: 8}]}>
                <Text style={[styles.cardItemHeader, {paddingBottom: 8, paddingStart: 8}]}>
                  Variations
                </Text>
                <FlatGrid
                  items={attributes}
                  keyExtractor={this._keyExtractor}
                  renderItem={({item, index}) => (
                    <CustomPicker
                      options={item.options}
                      getLabel={option => (option && option.slug ? option.name : option)}
                      fieldTemplate={PickerField}
                      placeholder={item.name}
                      modalAnimationType="slide"
                      onValueChange={this.onVariationChange(item)}
                    />
                  )}
                  itemDimension={180}
                  spacing={8}
                  itemContainerStyle={{justifyContent: "flex-start"}}
                />
              </View>
            )}
            <View style={styles.card}>
              <Text style={styles.cardItemHeader}>Specification</Text>
              <View style={styles.cardItem}>
                <SpecificationRow
                  leftContent="Categories"
                  rightContent={product.categories.map(item => item.name).join(", ")}
                />

                {product.hasOwnProperty("total_sales") && (
                  <SpecificationRow leftContent="Total Sales" rightContent={product.total_sales} />
                )}

                {product.stock_quantity && (
                  <SpecificationRow
                    leftContent="Stock Quantity"
                    rightContent={product.stock_quantity}
                  />
                )}

                {product.hasOwnProperty("sku") && product.sku != "" && (
                  <SpecificationRow leftContent="SKU" rightContent={product.sku} />
                )}
                {product.hasOwnProperty("weight") && product.weight != "" && (
                  <SpecificationRow leftContent="Weight" rightContent={product.stock_quantity} />
                )}

                {product.attributes.map((item, index) => (
                  <SpecificationRow
                    leftContent={item.name}
                    rightContent={item.options.map(opt => (opt.slug ? opt.name : opt)).join(", ")}
                    key={item.name + index}
                  />
                ))}
              </View>
            </View>
            {product.description != "" && (
              <View style={styles.card}>
                <Text style={styles.cardItemHeader}>Description</Text>
                <HTMLRender html={product.short_description} containerStyle={styles.cardItem} />
              </View>
            )}
            {product.upsell && product.upsell.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardItemHeader}>Products you may like</Text>
                <ProductsRow keyPrefix="product" products={product.upsell} />
              </View>
            )}
            {product.related && product.related.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardItemHeader}>Related Products</Text>
                <ProductsRow keyPrefix="product" products={product.related} />
              </View>
            )}
          </ScrollView>

          {/* Footer Content */}
          {(product.purchasable ||
            (product.type === "external" && product.external_url) ||
            product.type === "grouped") && (
            <View style={styles.footer}>
              {((!isEmpty(variation) && variation.in_stock) || product.in_stock) && (
                <Fragment>
                  <Button
                    onPress={() => this._handleAddToCart(true)}
                    style={[styles.footerButton, {backgroundColor: "#f7f7f7"}]}>
                    <Text>Buy Now</Text>
                  </Button>
                  <Button
                    style={[styles.footerButton, {backgroundColor: accent_color}]}
                    onPress={() => this._handleAddToCart(false)}>
                    <Text style={{color: "white"}}>Add to Cart</Text>
                  </Button>
                </Fragment>
              )}
            </View>
          )}
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
    minHeight: 48,
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
});

const mapStateToProps = state => ({
  appSettings: state.appSettings,
});
const mapDispatchToProps = {
  getCartCount,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductDetailScreen);
