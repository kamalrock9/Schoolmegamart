import React, {Component, Fragment} from "react";
import {View, StyleSheet, ScrollView} from "react-native";
import {Button, Icon, Card, CardItem, Body} from "native-base";
import {connect} from "react-redux";
import StarRating from "react-native-star-rating";
import RNFetchBlob from "rn-fetch-blob";
import Share from "react-native-share";
import RBSheet from "react-native-raw-bottom-sheet";
import {
    Slider,
    Toolbar,
    Html,
    QuantitySelector,
    Text,
    ProductsRow
} from "../../components";
import SpecificationRow from "./SpecificationRow";
import MiniCart from "./MiniCart";
import {getProductById, addCart} from "../../../rest";

class ProductDetailScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        header: (
            <Toolbar
                backButton
                title={navigation.state.params.name}
                cartButton
            />
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            quantity: 1,
            product: this.props.navigation.state.params,
            cartMsg: ""
        };
        this.setup();
    }

    setup = () => {
        if (this.state.product.upsell_ids.length > 0) {
            getProductById(this.state.product.upsell_ids.join())
                .then(response => {
                    this.setState(prevState => ({
                        product: {...prevState.product, upsell: response}
                    }));
                })
                .catch(error => {});
        }
        if (this.state.product.related_ids.length > 0) {
            getProductById(this.state.product.related_ids.join())
                .then(response => {
                    this.setState(prevState => ({
                        product: {...prevState.product, related: response}
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
            subject: this.state.product.name
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
        this.setState({
            quantity: this.state.quantity + 1
        });
    };
    _decreaseCounter = () => {
        if (this.state.quantity > 1) {
            this.setState({
                quantity: this.state.quantity - 1
            });
        }
    };

    _handleAddToCart = (isBuyNow = false) => {
        let data = {
            id: this.state.product.id,
            quantity: this.state.quantity
        };
        addCart(data)
            .then(response => {
                console.log(response);

                this.setState({
                    cartMsg: Array.isArray(response)
                        ? response.map(e => e.message).join(", ")
                        : response.message
                });

                if (this.isError(response)) {
                    console.log("error");
                    //this.toast.showWithClose(msg);
                } else {
                    if (isBuyNow) {
                        this.props.navigation.navigate("Cart");
                    } else {
                        this._openRBSheet();
                    }
                    //this.events.publish("cartchanged");
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

    _openRBSheet = () => {
        this.RBSheet.open();
    };
    _closeRBSheet = () => {
        this.RBSheet.close();
    };

    render() {
        const {appSettings} = this.props;
        const {product} = this.state;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <Slider data={product.images} />
                    </View>
                    <Card style={[styles.card, {marginTop: 0}]}>
                        <CardItem style={[styles.cardItem, {paddingTop: 4}]}>
                            <Body>
                                <View style={styles.rowCenterSpaced}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            color: "#000000",
                                            fontWeight: "700"
                                        }}>
                                        {product.name}
                                    </Text>
                                    <Button
                                        transparent
                                        onPress={this.shareProduct}>
                                        <Icon name="md-share" />
                                    </Button>
                                </View>

                                {product.short_description != "" && (
                                    <Html html={product.short_description} />
                                )}

                                <View style={styles.rowCenterSpaced}>
                                    <Html
                                        html={product.price_html}
                                        fontSize={16}
                                        fontWeight="500"
                                        containerStyle={{paddingTop: 8}}
                                    />
                                    <Text
                                        style={
                                            product.in_stock
                                                ? {color: "green"}
                                                : {color: "gray"}
                                        }>
                                        {product.in_stock
                                            ? "In stock"
                                            : "Out of stock"}
                                    </Text>
                                </View>

                                <View style={styles.rowCenterSpaced}>
                                    <Text>Quantity</Text>
                                    <QuantitySelector
                                        minusClick={this._decreaseCounter}
                                        plusClick={this._increaseCounter}
                                        quantity={this.state.quantity}
                                    />
                                </View>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={[styles.card, {marginTop: 10}]}>
                        <CardItem style={[styles.cardItem]}>
                            <Body>
                                <View style={{flexDirection: "row"}}>
                                    <StarRating
                                        disabled
                                        maxStars={5}
                                        rating={parseInt(
                                            product.average_rating
                                        )}
                                        containerStyle={{
                                            justifyContent: "flex-start"
                                        }}
                                        starStyle={{marginEnd: 5}}
                                        starSize={14}
                                        halfStarEnabled
                                        emptyStarColor={
                                            this.props.appSettings.accent_color
                                        }
                                        fullStarColor={
                                            this.props.appSettings.accent_color
                                        }
                                        halfStarColor={
                                            this.props.appSettings.accent_color
                                        }
                                    />
                                    <Text>({product.rating_count || 0})</Text>
                                    <Text> See all reviews</Text>
                                </View>
                            </Body>
                        </CardItem>
                    </Card>
                    {product.variations.length > 0 &&
                        product.attributes.length > 0 && (
                            <Card style={[styles.card, {marginTop: 10}]}>
                                <CardItem header style={styles.cardItem}>
                                    <Text style={styles.cardItemHeader}>
                                        Variations
                                    </Text>
                                </CardItem>
                                <CardItem style={[styles.cardItemWithHeader]} />
                            </Card>
                        )}
                    <Card style={[styles.card, {marginTop: 10}]}>
                        <CardItem header style={styles.cardItem}>
                            <Text style={styles.cardItemHeader}>
                                Specification
                            </Text>
                        </CardItem>
                        <CardItem style={[styles.cardItemWithHeader]}>
                            <Body>
                                <SpecificationRow
                                    leftContent="Categories"
                                    rightContent={product.categories
                                        .map(item => item.name)
                                        .join()}
                                />

                                {product.hasOwnProperty("total_sales") && (
                                    <SpecificationRow
                                        leftContent="Total Sales"
                                        rightContent={product.total_sales}
                                    />
                                )}

                                {product.stock_quantity && (
                                    <SpecificationRow
                                        leftContent="Stock Quantity"
                                        rightContent={product.stock_quantity}
                                    />
                                )}

                                {product.hasOwnProperty("sku") &&
                                    product.sku != "" && (
                                        <SpecificationRow
                                            leftContent="SKU"
                                            rightContent={product.sku}
                                        />
                                    )}
                                {product.hasOwnProperty("weight") &&
                                    product.weight != "" && (
                                        <SpecificationRow
                                            leftContent="Weight"
                                            rightContent={
                                                product.stock_quantity
                                            }
                                        />
                                    )}

                                {product.attributes.map((item, index) => (
                                    <SpecificationRow
                                        leftContent={item.name}
                                        rightContent={item.options
                                            .map(opt =>
                                                opt.slug ? opt.name : opt
                                            )
                                            .join()}
                                        key={item.name + index}
                                    />
                                ))}
                            </Body>
                        </CardItem>
                    </Card>
                    {product.description != "" && (
                        <Card style={[styles.card, {marginTop: 10}]}>
                            <CardItem header style={styles.cardItem}>
                                <Text style={styles.cardItemHeader}>
                                    Description
                                </Text>
                            </CardItem>
                            <CardItem style={[styles.cardItemWithHeader]}>
                                <Html html={product.short_description} />
                            </CardItem>
                        </Card>
                    )}
                    {product.upsell && product.upsell.length > 0 && (
                        <Card style={[styles.card, {marginTop: 10}]}>
                            <CardItem header style={styles.cardItem}>
                                <Text style={styles.cardItemHeader}>
                                    Products you may like
                                </Text>
                            </CardItem>

                            <ProductsRow
                                keyPrefix="product"
                                products={product.upsell}
                            />
                        </Card>
                    )}
                    {product.related && product.related.length > 0 && (
                        <Card style={[styles.card, {marginTop: 10}]}>
                            <CardItem header style={styles.cardItem}>
                                <Text style={styles.cardItemHeader}>
                                    Related Products
                                </Text>
                            </CardItem>

                            <ProductsRow
                                keyPrefix="product"
                                products={product.related}
                            />
                        </Card>
                    )}
                </ScrollView>

                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    customStyles={{
                        container: {
                            justifyContent: "space-between"
                        }
                    }}>
                    <MiniCart
                        appSettings={appSettings}
                        close={this._closeRBSheet}
                        message={this.state.cartMsg}
                    />
                </RBSheet>

                {/* Footer Content */}
                {product.purchasable ||
                (product.type === "external" && product.external_url) ||
                product.type === "grouped" ? (
                    <View style={styles.footer}>
                        {product.in_stock ? (
                            <Fragment>
                                <Button
                                    onPress={() => this._handleAddToCart(true)}
                                    style={[
                                        styles.footerButton,
                                        {backgroundColor: "#f7f7f7"}
                                    ]}>
                                    <Text>Buy Now</Text>
                                </Button>
                                <Button
                                    style={[
                                        styles.footerButton,
                                        {
                                            backgroundColor:
                                                appSettings.accent_color
                                        }
                                    ]}
                                    onPress={() =>
                                        this._handleAddToCart(false)
                                    }>
                                    <Text style={{color: "white"}}>
                                        Add to Cart
                                    </Text>
                                </Button>
                            </Fragment>
                        ) : null}
                    </View>
                ) : null}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    appSettings: state.appSettings
});
export default connect(mapStateToProps)(ProductDetailScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "space-between"
    },
    footer: {
        width: "100%",
        flexDirection: "row"
    },
    footerButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    rowCenterSpaced: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    card: {
        marginStart: 0,
        marginEnd: 0,
        elevation: 0
    },
    cardItem: {
        paddingStart: 12,
        paddingEnd: 12
    },
    cardItemHeader: {
        fontSize: 16,
        color: "#000000",
        fontWeight: "700"
    },
    cardItemWithHeader: {
        paddingStart: 12,
        paddingEnd: 12,
        paddingTop: 0
    }
});
