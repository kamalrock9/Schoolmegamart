import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  unstable_batchedUpdates,
} from "react-native";
import { Slider, Toolbar, Container } from "components";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import CategoryItem from "./CategoryItem";
import SectonHeader from "./SectonHeader";
import ProductsRow from "../product/ProductsRow";
import { saveHomeLayout, saveNotification } from "store/actions";
import { ApiClient } from "service";
import { useTranslation } from "react-i18next";
import OneSignal from "react-native-onesignal";

function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const layout = useSelector(state => state.homeLayout);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const _categoryKeyExtractor = item => "category_" + item.id;

  useEffect(() => {
    setLoading(layout ? false : true);
    ApiClient.get("/layout")
      .then(({ data }) => {
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

  const goTo = (route, params = {}) => {
    navigation.navigate(route, params);
  };

  const goToPage = (route, params = {}) => () => {
    navigation.navigate(route, params);
  }

  const gotoProductPage = (id) => {
    navigation.navigate("ProductScreen", { params: id });
  }

  const _renderItem = ({ item, index }) => <CategoryItem item={item} index={index} onpress={gotoProductPage} />

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
          <View>
            <Slider
              //autoplay
              //autoplayLoop
              //autoplayDelay={5}
              data={layout.banner}
              approxHeight={180}
            />
          </View>

          <SectonHeader
            title={t("ALL_CATEGORIES")}
            titleEnd={t("VIEW_ALL")}
            onPress={goTo}
            onPressArgs={["CategoryScreen"]}
          />

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={layout.categories}
            keyExtractor={_categoryKeyExtractor}
            renderItem={_renderItem}
            removeClippedSubviews={true}
          />

          {layout.featured_products && layout.featured_products.length > 0 && (
            <>
              <SectonHeader title={t("FEATURED")} titleEnd={t("SEE_MORE")} style={{ marginTop: 8 }} onPress={goToPage("ProductScreen", { feature: true })} />
              <ProductsRow keyPrefix="featured" products={layout.featured_products} />
            </>
          )}

          {layout.top_rated_products && layout.top_rated_products.length > 0 && (
            <>
              <SectonHeader title={t("TOP_SELLERS")} titleEnd={t("SEE_MORE")} style={{ marginTop: 8 }} onPress={goToPage("ProductScreen", { sortby: 'rating' })} />
              <ProductsRow keyPrefix="toprated" products={layout.top_rated_products} />
            </>
          )}

          {layout.sale_products && layout.sale_products.length > 0 && (
            <>
              <SectonHeader title={t("TRENDING_OFFERS")} titleEnd={t("SEE_MORE")} style={{ marginTop: 8 }} onPress={goToPage("ProductScreen", { on_sale: 'true' })} />
              <ProductsRow keyPrefix="sale" products={layout.sale_products} />
            </>
          )}

          {layout.top_seller && layout.top_seller.length > 0 && (
            <>
              <SectonHeader title={t("TOP_SELLERS")} titleEnd={t("SEE_MORE")} style={{ marginTop: 8 }} onPress={goToPage("ProductScreen", { sortby: 'popularity' })} />
              <ProductsRow keyPrefix="topseller" products={layout.top_seller} />
            </>
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
});

export default HomeScreen;
