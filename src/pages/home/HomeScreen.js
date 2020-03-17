import React, {useState, useEffect} from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  unstable_batchedUpdates,
} from "react-native";
import {Slider, Toolbar, Container} from "components";
import {useSelector, useDispatch} from "react-redux";
import {isEmpty} from "lodash";
import CategoryItem from "./CategoryItem";
import SectonHeader from "./SectonHeader";
import ProductsRow from "../product/ProductsRow";
import {saveHomeLayout} from "store/actions";
import {ApiClient} from "service";

function HomeScreen({navigation}) {
  const [loading, setLoading] = useState(false);
  const layout = useSelector(state => state.homeLayout);
  const dispatch = useDispatch();

  const _categoryKeyExtractor = item => "category_" + item.id;

  useEffect(() => {
    setLoading(layout ? false : true);
    ApiClient.get("/layout")
      .then(({data}) => {
        unstable_batchedUpdates(() => {
          dispatch(saveHomeLayout(data));
          setLoading(false);
        });
      })
      .catch(e => {
        setLoading(false);
      });
  }, []);

  const goTo = (route, params = {}) => {
    navigation.navigate(route, params);
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
        <Toolbar menuButton cartButton wishListButton title="HOME" />
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
            title="Categories"
            titleEnd="View All"
            onPress={goTo}
            onPressArgs={["CategoryScreen"]}
          />

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={layout.categories}
            keyExtractor={_categoryKeyExtractor}
            renderItem={CategoryItem}
            removeClippedSubviews={true}
          />

          {layout.featured_products && layout.featured_products.length > 0 && (
            <>
              <SectonHeader title="Featured" titleEnd="See More" style={{marginTop: 8}} />
              <ProductsRow keyPrefix="featured" products={layout.featured_products} />
            </>
          )}

          {layout.top_rated_products && layout.top_rated_products.length > 0 && (
            <>
              <SectonHeader title="Top Rated" titleEnd="See More" style={{marginTop: 8}} />
              <ProductsRow keyPrefix="toprated" products={layout.top_rated_products} />
            </>
          )}

          {layout.sale_products && layout.sale_products.length > 0 && (
            <>
              <SectonHeader title="Tranding Offers" titleEnd="See More" style={{marginTop: 8}} />
              <ProductsRow keyPrefix="sale" products={layout.sale_products} />
            </>
          )}

          {layout.top_seller && layout.top_seller.length > 0 && (
            <>
              <SectonHeader title="Top Sellers" titleEnd="See More" style={{marginTop: 8}} />
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
