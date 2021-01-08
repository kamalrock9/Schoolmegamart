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
  Linking,
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
//import {useNavigation} from "react-navigation-hooks";

const {width} = Dimensions.get("window");

const aspectHeight = (nWidth, oHeight, oWidth) => (nWidth * oHeight) / oWidth;

function HomeScreen({navigation}) {
  const [loading, setLoading] = useState(false);
  const layout = useSelector(state => state.homeLayout);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);

  // const navigation = useNavigation();

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
    Linking.getInitialURL().then(url => {
      // console.log(url);
      if (url && url.includes("/product")) {
        navigation.navigate("ProductDetailScreen", {itemByURL: url});
      }
    });
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
    OneSignal.init("d2ffef10-5370-48ff-b6aa-9d7a53f71054", {
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

  const _renderItem = ({item, index}) => <CategoryItem item={item} index={index} />;

  const gotoProductPage = item => () => {
    console.log("banner");
    // let params = {category_id: item.id, id: item.id, name: item.name};
    if (item.type == "product") {
      navigation.navigate("ProductDetailScreen", {itemByProduct: item});
    } else {
      navigation.navigate("ProductScreen", {category_id: item.id});
    }
  };

  const _renderItemCrousel = ({item, index}) => {
    return (
      <TouchableOpacity onPress={gotoProductPage(item)}>
        <Image
          style={{width: "100%", height: aspectHeight(width - 128, 200, 500), borderRadius: 4}}
          source={{uri: item.banner_url}}
          resizeMode={"cover"}
        />
        {/* <Text>{item.name}</Text> */}
      </TouchableOpacity>
    );
  };

  const _keyExtractor = item => item.id + "sap";

  const {accent_color} = useSelector(state => state.appSettings);

  const goToProductDetails = item => () => {
    if (item.type === "bundle") {
      navigation.navigate("ProductDetailScreen", {itemByProduct: item});
    } else {
      navigation.navigate("ProductDetailScreen", item);
    }
  };

  const _renderFlatItem = ({item, index}) => {
    var discount = Math.ceil(((item.regular_price - item.price) / item.regular_price) * 100);
    return (
      <TouchableOpacity style={{paddingTop: 10, marginTop: 8}} onPress={goToProductDetails(item)}>
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
      <TouchableOpacity onPress={goToProductDetails(item)}>
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
      </TouchableOpacity>
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

  const _renderItemForSecondBanner = ({item, index}) => (
    <SecondBanner item={item} index={index} navigation={navigation} />
  );

  const _keyExtractorForSecondBanner = (item, index) => item.id + "sap" + index;

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
          <View style={{backgroundColor: "#d2d2d2", height: 4}} />
          <View style={{marginTop: 16}}>
            <Carousel
              layout={"default"}
              ref={ref => {
                carousel = ref;
              }}
              data={layout.banner}
              sliderWidth={width}
              sliderHeight={200}
              itemWidth={width - 32}
              itemHeight={180}
              // pagingEnabled={true}
              renderItem={_renderItemCrousel}
              onSnapToItem={index => setactiveIndex(index)}
            />
            <Pagination
              dotsLength={layout.banner.length}
              activeDotIndex={activeIndex}
              containerStyle={{marginTop: -45, marginBottom: -24}}
              dotStyle={{
                width: 8,
                height: 8,
                borderRadius: 5,
                // marginTop: -20,
                marginHorizontal: -6,
                paddingHorizontal: -2,
                backgroundColor: "grey",
              }}
              inactiveDotStyle={{
                width: 12,
                height: 12,
                backgroundColor: "#fff",
              }}
              inactiveDotOpacity={0.8}
              inactiveDotScale={0.6}
            />
          </View>
          {/* <View>
            <Slider
              //autoplay
              //autoplayLoop
              //autoplayDelay={5}
              data={layout.banner}
              approxHeight={180}
            />
          </View> */}

          {!isEmpty(layout.section_banners) && (
            <View>
              {layout.section_banners.map((item, index) => {
                return item.layout_type == 2 && item.banner.length >= 2 ? (
                  <View key={item.id + "SAP" + index}>
                    <View style={{backgroundColor: "#d2d2d2", height: 4, marginTop: 16}} />
                    <View
                      style={{
                        backgroundColor:
                          item.background_color != "" ? item.background_color : "#FB7C00",
                        width: width,
                        padding: 16,
                        marginBottom: 16,
                        marginTop: 16,
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 16,
                            color: item.title_color != "" ? item.title_color : "#fff",
                          }}>
                          {item.title}
                        </Text>
                        <Button
                          style={{backgroundColor: "green", borderRadius: 4}}
                          onPress={gotoProductPage("")}>
                          <Text style={styles.viewAll}>View All</Text>
                        </Button>
                      </View>
                      <View style={{flexDirection: "row", marginTop: 16, marginBottom: -32}}>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[0])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / 2 - 24,
                              height: width / 2 - 8,
                              borderWidth: 1,
                              borderColor: "#d2d2d2",
                              marginEnd: 8,
                            }}
                            source={{uri: item.banner[0].banner_url}}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[1])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / 2 - 24,
                              height: width / 2 - 8,
                              borderWidth: 1,
                              borderColor: "#d2d2d2",
                              marginStart: 8,
                            }}
                            source={{uri: item.banner[1].banner_url}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : item.layout_type == 3 && item.banner.length >= 3 ? (
                  <View key={item.id + "SAP" + index}>
                    <View style={{backgroundColor: "#d2d2d2", height: 4, marginTop: 16}} />
                    <View
                      style={{
                        backgroundColor:
                          item.background_color != "" ? item.background_color : "#FB7C00",
                        width: width,
                        //padding: 16,
                        marginTop: 16,
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingHorizontal: 16,
                          marginTop: 16,
                        }}>
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 16,
                            color: item.title_color != "" ? item.title_color : "#fff",
                          }}>
                          {item.title}
                        </Text>
                        <Button
                          style={{backgroundColor: "green", borderRadius: 4}}
                          onPress={gotoProductPage("")}>
                          <Text style={styles.viewAll}>View All</Text>
                        </Button>
                      </View>
                      <View style={{flexDirection: "row", marginTop: 16}}>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[0])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / (4 / 3) - 58,
                              height: width / (4 / 3),
                              borderWidth: 1,
                              borderColor: "#d2d2d2",
                              marginEnd: 8,
                            }}
                            source={{uri: item.banner[0].banner_url}}
                          />
                        </TouchableOpacity>
                        <View>
                          <TouchableOpacity onPress={gotoProductPage(item.banner[1])}>
                            <Image
                              resizeMode={"contain"}
                              style={{
                                width: width / 3 + 16,
                                height: width / (8 / 3) - 8,
                                borderWidth: 1,
                                borderColor: "#d2d2d2",
                                marginStart: 8,
                                marginBottom: 8,
                              }}
                              source={{uri: item.banner[1].banner_url}}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={gotoProductPage(item.banner[2])}>
                            <Image
                              resizeMode={"contain"}
                              style={{
                                width: width / 3 + 16,
                                height: width / (8 / 3) - 8,
                                borderWidth: 1,
                                borderColor: "#d2d2d2",
                                marginStart: 8,
                                marginTop: 8,
                              }}
                              source={{uri: item.banner[2].banner_url}}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : item.layout_type == 4 && item.banner.length >= 4 ? (
                  <View key={item.id + "SAP" + index}>
                    <View style={{backgroundColor: "#d2d2d2", height: 4, marginTop: 16}} />
                    <View
                      style={{
                        backgroundColor:
                          item.background_color != "" ? item.background_color : "#FB7C00",
                        width: width,
                        padding: 16,
                        marginTop: 16,
                        marginBottom: 16,
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 16,
                            color: item.title_color != "" ? item.title_color : "#fff",
                          }}>
                          {item.title}
                        </Text>
                        <Button
                          style={{backgroundColor: "green", borderRadius: 4}}
                          onPress={gotoProductPage("")}>
                          <Text style={styles.viewAll}>View All</Text>
                        </Button>
                      </View>
                      <View style={{flexDirection: "row", marginTop: 16}}>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[0])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / 2 - 24,
                              height: width / 2 - 8,
                              borderWidth: 1,
                              borderColor: "#d2d2d2",
                              marginEnd: 8,
                            }}
                            source={{uri: item.banner[0].banner_url}}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[1])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / 2 - 24,
                              height: width / 2 - 8,
                              borderWidth: 1,
                              borderColor: "#d2d2d2",
                              marginStart: 8,
                            }}
                            source={{uri: item.banner[1].banner_url}}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{flexDirection: "row", marginBottom: -32}}>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[2])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / 2 - 24,
                              height: width / 2 - 8,
                              borderWidth: 1,
                              borderColor: "#d2d2d2",
                              marginTop: 16,
                              marginEnd: 8,
                            }}
                            source={{uri: item.banner[2].banner_url}}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[3])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / 2 - 24,
                              height: width / 2 - 8,
                              borderWidth: 1,
                              borderColor: "#d2d2d2",
                              marginTop: 16,
                              marginStart: 8,
                            }}
                            source={{uri: item.banner[3].banner_url}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : item.layout_type == 1 && item.banner.length >= 1 ? (
                  <View key={item.id + "SAP" + index}>
                    <View style={{backgroundColor: "#d2d2d2", height: 4, marginTop: 16}} />
                    <View
                      style={{
                        backgroundColor:
                          item.background_color != "" ? item.background_color : "#FB7C00",
                        width: width,
                        padding: 16,
                        marginTop: 16,
                        marginBottom: 32,
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 16,
                            color: item.title_color != "" ? item.title_color : "#fff",
                          }}>
                          {item.title}
                        </Text>
                        <Button
                          style={{backgroundColor: "green", borderRadius: 4}}
                          onPress={gotoProductPage("")}>
                          <Text style={styles.viewAll}>View All</Text>
                        </Button>
                      </View>
                      <TouchableOpacity onPress={gotoProductPage(item.banner[0])}>
                        <Image
                          resizeMode={"contain"}
                          style={{
                            marginTop: 16,
                            width: width - 32,
                            height: width / 3,
                            borderWidth: 1,
                            borderColor: "#d2d2d2",
                            marginBottom: -32,
                          }}
                          source={{uri: item.banner[0].banner_url}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View key={item + "Sap"} />
                );
              })}
            </View>
          )}

          <View style={{backgroundColor: "#d2d2d2", height: 4, marginTop: 16}} />

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

          {!isEmpty(layout.second_banner) && (
            <FlatList
              data={layout.second_banner}
              renderItem={_renderItemForSecondBanner}
              keyExtractor={_keyExtractorForSecondBanner}
            />
          )}

          {/* <TouchableOpacity onPress={gotoProductPage(layout.second_banner[1])}>
            <Image
              source={{uri: layout.second_banner[1].second_banner_img}}
              style={{
                width: width - 32,
                height: aspectHeight(width - 32, 325, 343),
                marginStart: 16,
                marginTop: 25,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={gotoProductPage(layout.second_banner[2])}>
            <Image
              source={{uri: layout.second_banner[2].second_banner_img}}
              style={{
                width: width - 32,
                height: aspectHeight(width - 32, 325, 343),
                marginStart: 16,
                marginTop: 25,
              }}
            />
          </TouchableOpacity> */}
          {/* 
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
          )} */}
          <View style={{backgroundColor: "#d2d2d2", height: 4, marginTop: 16}} />
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

function SecondBanner({item, index, navigation}) {
  const gotoProductPage = item => () => {
    console.log("banner");
    // let params = {category_id: item.id, id: item.id, name: item.name};
    if (item.type == "category") {
      navigation.navigate("ProductScreen", {category_id: item.id});
    } else {
      navigation.navigate("ProductDetailScreen", {itemByProduct: item});
    }
  };
  return (
    <View key={item.id + "Sap" + index}>
      <View style={{backgroundColor: "#d2d2d2", height: 4, marginTop: 16}} />
      <TouchableOpacity onPress={gotoProductPage(item)}>
        <Image
          source={{uri: item.banner_url}}
          style={{
            //backgroundColor: "red",
            width: width - 32,
            //flex: 1,
            height: aspectHeight(width - 32, 343, 343),
            marginStart: 16,
            marginTop: 25,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
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
    padding: 8,
  },
  viewAll: {
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: "500",
  },
});

export default HomeScreen;
