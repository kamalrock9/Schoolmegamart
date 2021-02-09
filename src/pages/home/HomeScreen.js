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
  Icon,
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
import {saveHomeLayout, saveNotification, getCartCount} from "store/actions";
import {ApiClient} from "service";
import {useTranslation} from "react-i18next";
import OneSignal from "react-native-onesignal";
import Carousel, {Pagination} from "react-native-snap-carousel";
import StarRating from "react-native-star-rating";
import {FlatGrid} from "react-native-super-grid";
import analytics from "@react-native-firebase/analytics";
import Toast from "react-native-simple-toast";

const {width} = Dimensions.get("window");

const aspectHeight = (nWidth, oHeight, oWidth) => (nWidth * oHeight) / oWidth;

function HomeScreen({navigation}) {
  const [loading, setLoading] = useState(false);
  const layout = useSelector(state => state.homeLayout);
  const {primary_color, accent_color} = useSelector(state => state.appSettings);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);

  const _categoryKeyExtractor = (item, index) => item.id + "category_" + index;

  const [activeIndex, setactiveIndex] = useState(0);
  const [data, setData] = useState([]);
  const [gridData, setgridData] = useState([]);

  useEffect(() => {
    trackScreenView("Home Screen");
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

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

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
    if (item.type == "static") {
      return;
    } else if (item.type == "page") {
      navigation.navigate("ProductScreen", {customPage: item.id});
    } else if (item.type == "product") {
      navigation.navigate("ProductDetailScreen", {itemByProduct: item});
    } else {
      navigation.navigate("ProductScreen", {category_id: item});
    }
  };

  const _renderItemCrousel = ({item, index}) => {
    return (
      <TouchableOpacity onPress={gotoProductPage(item)}>
        <Image
          style={{height: 80, width: width - 32}}
          source={{
            uri: item.banner_url
              ? item.banner_url
              : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
          }}
          resizeMode={"contain"}
        />
        {/* <Text>{item.name}</Text> */}
      </TouchableOpacity>
    );
  };
  const _keyExtractorHorizontal = (item, index) => item.id + "sap" + index;

  const _keyExtractor = item => item.id + "sap";

  const goToProductDetails = item => () => {
    if (item.type == "static") {
      return;
    } else if (item.type == "page") {
      navigation.navigate("ProductScreen", {customPage: item.id});
    } else if (item.type === "bundle") {
      navigation.navigate("ProductDetailScreen", {itemByProduct: item});
    } else {
      navigation.navigate("ProductDetailScreen", item);
    }
  };

  const _renderFlatItem = ({item, index}) => {
    var discount = Math.round(((item.regular_price - item.price) / item.regular_price) * 100, 2);
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
                marginTop: -10,
                marginEnd: -10,
                position: "absolute",
                top: 0,
                end: 0,
                backgroundColor: "#FF7272",
                width: 38,
                height: 38,
                borderRadius: 19,
                padding: 2,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text style={{fontSize: 10, color: "#fff", fontWeight: "600"}}>
                {isFinite(discount)
                  ? Math.round((discount + Number.EPSILON) * 10) / 10 + "%\nOFF"
                  : "SALE"}
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

  const _renderFlatItemHorizontal = ({item, index}) => {
    return (
      <TouchableOpacity
        key={item.id + "Sap" + index}
        style={{paddingTop: 10, marginTop: 8}}
        onPress={gotoProductPage(item)}>
        <View
          style={[
            styles.containerProduct,
            {width: 90, height: 150, marginEnd: 16, marginStart: index == 0 ? 16 : 0},
          ]}>
          <Image
            resizeMode="contain"
            style={{width: 90, height: 150}}
            source={{
              uri: item.banner_url
                ? item.banner_url
                : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
            }}
            indicatorColor={accent_color}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const _renderItemProduct = ({item, index}) => {
    var discount = Math.round(((item.regular_price - item.price) / item.regular_price) * 100, 2);

    return (
      <TouchableOpacity onPress={goToProductDetails(item)}>
        <>
          <View
            style={{
              marginStart: index == 0 ? 16 : 0,
              marginEnd: 16,
              //backgroundColor: "#EAEAF1",
              paddingVertical: 7,
              borderRadius: 8,
              marginTop: 8,
              width: 150,
              alignItems: "center",
              borderColor: "#f8f8fa",
              borderWidth: 4,
            }}>
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
                  backgroundColor: "#FF7272",
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text style={{fontSize: 10, color: "#fff", fontWeight: "600"}}>
                  {isFinite(discount)
                    ? Math.round((discount + Number.EPSILON) * 10) / 10 + "%"
                    : "SALE"}
                </Text>
              </View>
            )}
            <WishlistIcon style={styles.right} item={item} size={20} />
          </View>
          <View style={{width: 150, marginStart: index == 0 ? 16 : 0}}>
            <Text style={[styles.itemMargin, {fontWeight: "600", fontSize: 12}]}>{item.name}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}>
              <View>
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
                {item.price_html != "" && (
                  <HTMLRender
                    html={item.price_html}
                    containerStyle={styles.itemMargin}
                    baseFontStyle={{fontSize: 12, fontWeight: "700"}}
                  />
                )}
              </View>
              {/* <Button onPress={_addToCart(item)}>
                <Icon style={{marginTop: 8}} name="handbag" type="SimpleLineIcons" size={24} />
              </Button> */}
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

  const _addToCart = product => () => {
    console.log(product);
    let data = {id: product.id, quantity: 1};

    if (product.in_stock == false) {
      Toast.show("Porduct is out of stock.", Toast.SHORT);
      return;
    }

    switch (product.type) {
      case "simple":
        data.quantity = 1;
        break;
      default:
        this.props.navigation.navigate("ProductDetailScreen", {item: product});
        break;
    }
    //console.log(JSON.stringify(data));
    setLoading(true);
    ApiClient.post("/cart/add", data)
      .then(({data}) => {
        console.log(data);
        setLoading(false);
        if (data.code) {
          Toast.show(data.message, Toast.LONG);
        }
        dispatch(getCartCount());
      })
      .catch(error => {
        setLoading(false);
        //console.log(error);
      });
  };

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
        <Toolbar menuButton cartButton wishListButton searchButton title="" image={true} />
        <ScrollView nestedScrollEnabled={true}>
          {/* <SectonHeader
            title={t("ALL_CATEGORIES")}
            titleEnd={t("VIEW_ALL")}
            onPress={openCategories}
            onPressArgs={["CategoryScreen"]}
          /> */}
          <View
            style={{paddingVertical: 15, backgroundColor: primary_color, paddingHorizontal: 16}}>
            <Text style={{fontWeight: "600"}}>Collections</Text>
            <FlatList
              style={{paddingVertical: 15, backgroundColor: primary_color}}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={layout.categories}
              keyExtractor={_categoryKeyExtractor}
              renderItem={_renderItem}
              removeClippedSubviews={true}
            />
          </View>
          {/* <View style={{backgroundColor: "#d2d2d2", height: 4}} /> */}
          <View style={{paddingVertical: 18, paddingHorizontal: 16, backgroundColor: "#f8f8f8"}}>
            <Carousel
              layout={"default"}
              ref={ref => {
                carousel = ref;
              }}
              data={layout.banner}
              sliderWidth={width - 32}
              sliderHeight={80}
              itemWidth={width - 32}
              itemHeight={80}
              // pagingEnabled={true}
              renderItem={_renderItemCrousel}
              onSnapToItem={index => setactiveIndex(index)}
            />
            <Pagination
              dotsLength={isEmpty(layout.banner) ? 1 : layout.banner.length}
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
                    <View style={{backgroundColor: "#f8f8f8", height: 4, marginTop: 16}} />
                    <View
                      style={{
                        backgroundColor:
                          item.background_color != "" ? item.background_color : "#FB7C00",
                        width: width,
                        padding: 16,
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
                          style={{borderRadius: 4, flexDirection: "row", alignItems: "center"}}
                          onPress={gotoProductPage("")}>
                          <Text style={styles.viewAll}>SEE ALL</Text>
                          <Icon
                            style={{backgroundColor: "#ED7833", borderRadius: 12}}
                            color="#fff"
                            type="MaterialIcons"
                            name="keyboard-arrow-right"
                            size={20}
                          />
                        </Button>
                      </View>
                      <View style={{flexDirection: "row", alignItems: "center"}}>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[0])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / 2 - 60,
                              height: width / 3 + 16,
                              // borderWidth: 1,
                              // borderColor: "#d2d2d2",
                              marginEnd: 4,
                            }}
                            source={{
                              uri: item.banner[0].banner_url
                                ? item.banner[0].banner_url
                                : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[1])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / 2 + 20,
                              height: width / 2 - 8,
                              // borderWidth: 1,
                              // borderColor: "#d2d2d2",
                              marginStart: 4,
                            }}
                            source={{uri: item.banner[1].banner_url}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : item.layout_type == 3 && item.banner.length >= 3 ? (
                  <View key={item.id + "SAP" + index}>
                    <View
                      style={{
                        backgroundColor:
                          item.background_color != "" ? item.background_color : "#FB7C00",
                        width: width,
                        //padding: 16,
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
                          style={{borderRadius: 4, flexDirection: "row", alignItems: "center"}}
                          onPress={gotoProductPage("")}>
                          <Text style={styles.viewAll}>SEE ALL</Text>
                          <Icon
                            style={{backgroundColor: "#ED7833", borderRadius: 12}}
                            color="#fff"
                            type="MaterialIcons"
                            name="keyboard-arrow-right"
                            size={20}
                          />
                        </Button>
                      </View>
                      <View style={{flexDirection: "row", marginTop: 16}}>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[0])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / (4 / 3) - 97,
                              height: width / (4 / 3),
                              //  borderWidth: 1,
                              //borderColor: "#d2d2d2",
                              //  backgroundColor:"red",
                              marginEnd: 8,
                              marginStart: 16,
                            }}
                            source={{
                              uri: item.banner[0].banner_url
                                ? item.banner[0].banner_url
                                : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
                            }}
                          />
                        </TouchableOpacity>
                        <View>
                          <TouchableOpacity onPress={gotoProductPage(item.banner[1])}>
                            <Image
                              resizeMode={"contain"}
                              style={{
                                width: width / 3 + 16,
                                height: width / (8 / 3) - 8,
                                // borderWidth: 1,
                                //borderColor: "#d2d2d2",
                                marginStart: 8,
                                marginBottom: 8,
                              }}
                              source={{
                                uri: item.banner[1].banner_url
                                  ? item.banner[1].banner_url
                                  : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={gotoProductPage(item.banner[2])}>
                            <Image
                              resizeMode={"contain"}
                              style={{
                                width: width / 3 + 18,
                                height: width / (8 / 3) - 8,
                                //  borderWidth: 1,
                                //  borderColor: "#d2d2d2",
                                marginStart: 8,
                                marginTop: 8,
                              }}
                              source={{
                                uri: item.banner[2].banner_url
                                  ? item.banner[2].banner_url
                                  : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : item.layout_type == 4 && item.banner.length >= 4 ? (
                  <View key={item.id + "SAP" + index}>
                    <View
                      style={{
                        backgroundColor:
                          item.background_color != "" ? item.background_color : "#FB7C00",
                        width: width,
                        padding: 16,
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
                          style={{alignItems: "center", flexDirection: "row", borderRadius: 4}}
                          onPress={gotoProductPage("")}>
                          <Text style={styles.viewAll}>SEE ALL</Text>
                          <Icon
                            style={{backgroundColor: "#ED7833", borderRadius: 12}}
                            color="#fff"
                            type="MaterialIcons"
                            name="keyboard-arrow-right"
                            size={20}
                          />
                        </Button>
                      </View>
                      <View style={{flexDirection: "row"}}>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[0])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / 2 - 24,
                              height: width / 2 - 8,
                              // borderWidth: 1,
                              // borderColor: "#d2d2d2",
                              marginEnd: 8,
                            }}
                            source={{
                              uri: item.banner[0].banner_url
                                ? item.banner[0].banner_url
                                : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[1])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / 2 - 24,
                              height: width / 2 - 8,
                              // borderWidth: 1,
                              // borderColor: "#d2d2d2",
                              marginStart: 8,
                            }}
                            source={{
                              uri: item.banner[1].banner_url
                                ? item.banner[1].banner_url
                                : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
                            }}
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
                              // borderWidth: 1,
                              // borderColor: "#d2d2d2",
                              marginEnd: 8,
                            }}
                            source={{
                              uri: item.banner[2].banner_url
                                ? item.banner[2].banner_url
                                : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={gotoProductPage(item.banner[3])}>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: width / 2 - 24,
                              height: width / 2 - 8,
                              // borderWidth: 1,
                              // borderColor: "#d2d2d2",
                              marginStart: 8,
                            }}
                            source={{
                              uri: item.banner[3].banner_url
                                ? item.banner[3].banner_url
                                : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : item.layout_type == 1 && item.banner.length >= 1 ? (
                  <View key={item.id + "SAP" + index}>
                    <View style={{backgroundColor: "#d2d2d2", height: 4, marginTop: 8}} />
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
                          source={{
                            uri: item.banner[0].banner_url
                              ? item.banner[0].banner_url
                              : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
                          }}
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
          <View style={{backgroundColor: "#f8f8f8", height: 4, marginTop: 12}} />
          {layout.section_banners.map((item, index) => {
            return (
              item.layout_type === "horigental" &&
              item.banner.length >= 1 && (
                <View key={item + "Sap" + index}>
                  <View
                    style={{
                      backgroundColor:
                        item.background_color != "" ? item.background_color : "#FB7C00",
                      width: width,
                      paddingHorizontal: 16,
                      marginTop: 8,
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
                          flex: 1,
                          color: item.title_color != "" ? item.title_color : "#fff",
                        }}>
                        {item.title}
                      </Text>
                      <Button
                        style={{flexDirection: "row", alignItems: "center", borderRadius: 4}}
                        onPress={gotoProductPage("")}>
                        <Text style={styles.viewAll}>SEE ALL</Text>
                        <Icon
                          style={{backgroundColor: "#ED7833", borderRadius: 12}}
                          color="#fff"
                          type="MaterialIcons"
                          name="keyboard-arrow-right"
                          size={20}
                        />
                      </Button>
                    </View>
                  </View>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={item.banner}
                    keyExtractor={_keyExtractorHorizontal}
                    renderItem={_renderFlatItemHorizontal}
                    initialNumToRender={5}
                    nestedScrollEnabled={true}
                  />
                </View>
              )
            );
          })}

          <View style={{backgroundColor: "#f8f8f8", height: 4, marginTop: 12}} />

          {layout.featured_products && layout.featured_products.length > 0 && (
            <>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={layout.featured_products}
                keyExtractor={_keyExtractor}
                renderItem={_renderFlatItem}
                initialNumToRender={5}
                nestedScrollEnabled={true}
              />
            </>
          )}

          {!isEmpty(layout.second_banner) && (
            <FlatList
              data={layout.second_banner}
              renderItem={_renderItemForSecondBanner}
              keyExtractor={_keyExtractorForSecondBanner}
            />
          )}

          <View style={{backgroundColor: "#f8f8f8", height: 4, marginTop: 16}} />
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
                  {color: index == 0 ? accent_color : "#000"},
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
                  {color: index == 1 ? accent_color : "#000"},
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
                  {color: index == 2 ? accent_color : "#000"},
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
                  {color: index == 3 ? accent_color : "#000"},
                  {fontWeight: index == 3 ? "600" : "500"},
                  {fontSize: index == 3 ? 16 : 12},
                ]}>
                Featured
              </Text>
            </Button>
          </View>
          {!isEmpty(gridData) && (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={gridData}
              keyExtractor={_keyExtractorProduct}
              renderItem={_renderItemProduct}
              initialNumToRender={5}
              nestedScrollEnabled={true}
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
    if (item.type == "static") {
      return;
    } else if (item.type == "page") {
      navigation.navigate("ProductScreen", {customPage: item.id});
    } else if (item.type == "category") {
      navigation.navigate("ProductScreen", {category_id: item});
    } else {
      navigation.navigate("ProductDetailScreen", {itemByProduct: item});
    }
  };
  return (
    <View key={item.id + "Sap" + index}>
      <View style={{backgroundColor: "#f8f8f8", height: 4, marginTop: 16}} />
      <TouchableOpacity onPress={gotoProductPage(item)}>
        <Image
          source={{
            uri: item.banner_url
              ? item.banner_url
              : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
          }}
          style={{
            //backgroundColor: "red",
            width: width - 32,
            //flex: 1,
            height: aspectHeight(width - 32, 343, 343),
            marginStart: 16,
            marginTop: 16,
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
    // marginStart: 8,
    marginTop: 4,
    //flex: 1,
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
  tab: {
    fontSize: 12,
    fontWeight: "500",
    padding: 8,
  },
  viewAll: {
    color: "#000",
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 10,
    fontWeight: "400",
  },
});

export default HomeScreen;
