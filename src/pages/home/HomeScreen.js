import React, {useState, useEffect} from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  unstable_batchedUpdates,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import {
  Slider,
  Toolbar,
  Container,
  Text,
  EmptyList,
  Button,
  HTMLRender,
  WishlistIcon,
} from "components";
import {useSelector, useDispatch} from "react-redux";
import {isEmpty} from "lodash";
import CategoryItem from "./CategoryItem";
import SectonHeader from "./SectonHeader";
import ProductsRow from "../product/ProductsRow";
import {saveHomeLayout, saveNotification} from "store/actions";
import {ApiClient} from "service";
import {useTranslation} from "react-i18next";
import OneSignal from "react-native-onesignal";
import Carousel, {Pagination} from "react-native-snap-carousel";
import StarRating from "react-native-star-rating";
import {FlatGrid} from "react-native-super-grid";
import ProductItem from "../product/ProductItem";
import {useNavigation} from "react-navigation-hooks";

const {width} = Dimensions.get("window");
function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const layout = useSelector(state => state.homeLayout);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);

  const navigation = useNavigation();

  const _categoryKeyExtractor = (item, index) => item.id + "category_" + index;

  const [activeIndex, setactiveIndex] = useState(0);
  const [data, setData] = useState([]);
  const [gridData, setgridData] = useState([]);

  // const trackScreenView = async screen => {
  //   // Set & override the MainActivity screen name
  //   await analytics().setCurrentScreen(screen, screen);
  // };

  useEffect(() => {
    //trackScreenView("Home Page");
    setLoading(layout ? false : true);
    ApiClient.get("/layout")
      .then(({data}) => {
        console.log(data);
        setData(data);
        setgridData(data.top_rated_products);
        unstable_batchedUpdates(() => {
          dispatch(saveHomeLayout(data));
          setLoading(false);
        });
      })
      .catch(e => {
        setLoading(false);
      });
    OneSignal.init("71c73d59-6d8f-4824-a473-e76fe6663814", {
      kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener("received", onReceived);
    OneSignal.addEventListener("opened", onOpened);
    return () => {
      OneSignal.removeEventListener("received", onReceived);
      OneSignal.removeEventListener("opened", onOpened);
    };
  }, []);

  const onReceived = notification => {
    console.log("Notification received: ", notification);
    dispatch(saveNotification(notification.payload));
  };

  const onOpened = openResult => {
    console.log("Message: ", openResult.notification.payload);
    console.log("openResult: ", openResult.notification);
    // navigationDeferred.promise.then(() => {
    //   NavigationService.navigate("NotificationScreen");
    // });
  };

  const goToPage = (route, params = {}) => () => {
    navigation.navigate(route, params);
  };

  const openCategories = () => {
    navigation.navigate("CategoryScreen");
  };

  const _renderItem = ({item, index}) => <CategoryItem item={item} index={index} />;

  const gotoProductPage = item => () => {
    console.log("banner");
    let params = {category_id: null, id: item.id, name: item.name};
    navigation.navigate("ProductScreen", params);
  };

  const _renderItemCrousel = ({item, index}) => {
    return (
      <TouchableOpacity onPress={gotoProductPage(item)}>
        <Image
          style={{width: "100%", height: 120, borderRadius: 4}}
          source={{uri: item.banner_url}}
          resizeMode={"cover"}
        />
        {/* <Text>{item.name}</Text> */}
      </TouchableOpacity>
    );
  };

  const _keyExtractor = (item, index) => index + "sap" + item.id;

  const {accent_color} = useSelector(state => state.appSettings);

  const goToProductDetails = item => () => {
    navigation.navigate("ProductDetailScreen", item);
  };

  const _renderFlatItem = ({item, index}) => {
    var discount = Math.ceil(((item.regular_price - item.price) / item.regular_price) * 100);
    return (
      <TouchableOpacity style={{paddingTop: 10}} onPress={goToProductDetails(item)}>
        <View
          style={[
            styles.containerProduct,
            {width: 100, height: 120},
            {
              backgroundColor:
                index == 0
                  ? "#CBEAF5"
                  : index == 2
                  ? "#BFEFD6"
                  : index == 3
                  ? "#E5C8EF"
                  : index == 1
                  ? "#F0E6C3"
                  : index == 5
                  ? "#BFEFD6"
                  : index == 4
                  ? "#E5C8EF"
                  : "CBEAF5",
            },
            index == 0 ? {marginStart: 16, marginEnd: 14} : {marginEnd: 14},
          ]}>
          {item.images.length > 0 && (
            <Image
              resizeMode="contain"
              style={{width: 100, height: 100}}
              source={{uri: item.images[0].src}}
              indicatorColor={accent_color}
            />
          )}
          {item.on_sale && (
            <View
              style={{
                marginTop: -10,
                marginEnd: -10,
                position: "absolute",
                top: 0,
                end: 0,
                backgroundColor: accent_color,
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text style={{fontSize: 10, color: "#fff", fontWeight: "600"}}>
                {isFinite(discount) ? discount + "%\nOFF" : "SALE"}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.itemMargin,
            {fontWeight: "600", width: 100, fontSize: 12},
            index == 0 ? {marginStart: 16, marginEnd: 14} : {marginEnd: 0, marginStart: 0},
          ]}
          numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const _renderItemProduct = ({item, index}) => {
    var discount = Math.ceil(((item.regular_price - item.price) / item.regular_price) * 100);

    return (
      <TouchableWithoutFeedback onPress={goToProductDetails(item)}>
        <>
          <View
            style={[
              index % 2 == 0 ? {marginStart: 12} : {marginStart: 8},
              {
                width: width / 2 - 30,
                backgroundColor: "#EAEAF1",
                paddingVertical: 20,
                borderRadius: 8,
                marginTop: 8,
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
            <WishlistIcon style={styles.right} item={item} />
          </View>
          <View>
            <Text style={[styles.itemMargin, {fontWeight: "600", fontSize: 12}]} numberOfLines={1}>
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
        </>
      </TouchableWithoutFeedback>
    );
  };

  const _keyExtractorProduct = item => "products_" + item.id;

  // const onEndReached = () => {
  //   if (!this.state.hasMore) return;
  //   this.params.page++;
  //   this.setState({loading: true, hasMore: false}, () => this.loadProducts());
  // };

  const gotoIndex = index => () => {
    setIndex(index);
    if (index == 0) {
      setgridData(data.top_rated_products);
    } else if (index == 1) {
      setgridData(data.sale_products);
    } else if (index == 2) {
      setgridData(data.featured_products);
    } else {
      setgridData(data.top_seller);
    }
  };

  let carousel = null;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  } else if (isEmpty(layout)) {
    return <View />;
  } else {
    return (
      <Container>
        <Toolbar menuButton cartButton wishListButton searchButton title="HOME" />
        <ScrollView nestedScrollEnabled={true}>
          {/* <SectonHeader
            title={t("ALL_CATEGORIES")}
            titleEnd={t("VIEW_ALL")}
            onPress={openCategories}
            onPressArgs={["CategoryScreen"]}
          /> */}

          <FlatList
            style={{marginVertical: 15}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={layout.categories}
            keyExtractor={_categoryKeyExtractor}
            renderItem={_renderItem}
            removeClippedSubviews={true}
          />
          <>
            <Carousel
              layout={"default"}
              ref={ref => {
                carousel = ref;
              }}
              data={layout.banner}
              sliderWidth={width}
              sliderHeight={200}
              itemWidth={300}
              itemHeight={180}
              pagingEnabled={true}
              renderItem={_renderItemCrousel}
              onSnapToItem={index => setactiveIndex(index)}
            />
            <Pagination
              dotsLength={layout.banner.length}
              activeDotIndex={activeIndex}
              containerStyle={{marginTop: -20}}
              dotStyle={{
                width: 24,
                height: 6,
                borderRadius: 5,
                // marginTop: -20,
                marginHorizontal: -4,
                paddingHorizontal: -2,
                backgroundColor: "grey",
              }}
              inactiveDotStyle={{
                width: 18,
                height: 8,
                backgroundColor: "grey",
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </>
          {/* <View>
            <Slider
              //autoplay
              //autoplayLoop
              //autoplayDelay={5}
              data={layout.banner}
              approxHeight={180}
            />
          </View> */}

          {layout.featured_products && layout.featured_products.length > 0 && (
            <>
              {/* <SectonHeader
                title={t("FEATURED")}
                titleEnd={t("SEE_MORE")}
                style={{marginTop: 8}}
                onPress={goToPage("ProductScreen", {featured: true})}
              /> */}
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={layout.featured_products}
                keyExtractor={_keyExtractor}
                renderItem={_renderFlatItem}
                initialNumToRender={5}
                nestedScrollEnabled={true}
              />
              {/* <ProductsRow keyPrefix="featured" products={layout.featured_products} /> */}
            </>
          )}

          <Image
            source={require("../../assets/imgs/homePageBanner.png")}
            style={{width: width - 32, marginStart: 16, marginTop: 25}}
          />

          <Image
            source={require("../../assets/imgs/homePageBanner1.png")}
            style={{width: width - 32, marginStart: 16, marginTop: 25}}
          />

          <Image
            source={require("../../assets/imgs/homePageBanner2.png")}
            style={{width: width - 32, marginStart: 16, marginTop: 25}}
          />

          {layout.top_rated_products && layout.top_rated_products.length > 0 && (
            <>
              <SectonHeader
                title={t("TOP_SELLERS")}
                titleEnd={t("SEE_MORE")}
                style={{marginTop: 8}}
                onPress={goToPage("ProductScreen", {sortby: "rating"})}
              />
              <ProductsRow keyPrefix="toprated" products={layout.top_rated_products} />
            </>
          )}

          {layout.sale_products && layout.sale_products.length > 0 && (
            <>
              <SectonHeader
                title={t("TRENDING_OFFERS")}
                titleEnd={t("SEE_MORE")}
                style={{marginTop: 8}}
                onPress={goToPage("ProductScreen", {on_sale: "true"})}
              />
              <ProductsRow keyPrefix="sale" products={layout.sale_products} />
            </>
          )}

          {layout.top_seller && layout.top_seller.length > 0 && (
            <>
              <SectonHeader
                title={t("TOP_SELLERS")}
                titleEnd={t("SEE_MORE")}
                style={{marginTop: 8}}
                onPress={goToPage("ProductScreen", {sortby: "popularity"})}
              />
              <ProductsRow keyPrefix="topseller" products={layout.top_seller} />
            </>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              margin: 16,
            }}>
            <Button onPress={gotoIndex(0)}>
              <Text
                style={[
                  styles.tab,
                  {fontWeight: index == 0 ? "600" : "500"},
                  {fontSize: index == 0 ? 16 : 12},
                ]}>
                All
              </Text>
            </Button>
            <Button onPress={gotoIndex(1)}>
              <Text
                style={[
                  styles.tab,
                  {fontWeight: index == 1 ? "600" : "500"},
                  {fontSize: index == 1 ? 16 : 12},
                ]}>
                Popular
              </Text>
            </Button>
            <Button onPress={gotoIndex(2)}>
              <Text
                style={[
                  styles.tab,
                  {fontWeight: index == 2 ? "600" : "500"},
                  {fontSize: index == 2 ? 16 : 12},
                ]}>
                Most Seller
              </Text>
            </Button>
            <Button onPress={gotoIndex(3)}>
              <Text
                style={[
                  styles.tab,
                  {fontWeight: index == 3 ? "600" : "500"},
                  {fontSize: index == 3 ? 16 : 12},
                ]}>
                Feature
              </Text>
            </Button>
          </View>
          {!isEmpty(gridData) && (
            <FlatGrid
              items={gridData}
              keyExtractor={_keyExtractorProduct}
              renderItem={_renderItemProduct}
              itemDimension={160}
              spacing={8}
              //  onEndReached={onEndReached}
              onEndReachedThreshold={0.33}
              contentContainerStyle={{flexGrow: 1}}
              showsVerticalScrollIndicator={!loading}
              itemContainerStyle={{justifyContent: "flex-start"}}
              //  ListHeaderComponent={this.listHeaderComponent}
              ListEmptyComponent={<EmptyList loading={loading} label="Products not available" />}
              // ListFooterComponent={
              //   products.length > 0 && loading ? (
              //     <ActivityIndicator color={accent_color} size="large" style={{padding: 16}} />
              //   ) : null
              // }
            />
          )}
        </ScrollView>
      </Container>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerProduct: {
    //flex: 1,
    borderRadius: 6,
    paddingBottom: 8,
    justifyContent: "flex-end",
  },
  star: {
    justifyContent: "flex-start",
  },
  itemMargin: {
    marginStart: 8,
    marginTop: 4,
    flex: 1,
  },
  right: {
    position: "absolute",
    end: 0,
    top: 0,
    marginTop: 10,
    marginEnd: 10,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  tab: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default HomeScreen;
