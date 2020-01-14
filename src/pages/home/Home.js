import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {ProductsRow, Slider, Toolbar} from '../../components';
import {connect} from 'react-redux';
import CategoryItem from './CategoryItem';
import SectonHeader from './SectonHeader';
import {getHomeLayout} from '../../../store/actions';

class Home extends React.PureComponent {
  static navigationOptions = {
    header: <Toolbar menuButton cartButton wishListButton />,
  };

  constructor(props) {
    super(props);
    this.props.getHomeLayout();
  }

  goTo = (route, data) => {
    if (!data) {
      this.props.navigation.navigate(route);
    } else {
      this.props.navigation.navigate(route, data);
    }
  };

  _categoryKeyExtractor = (item, index) => 'category_' + item.id;

  render() {
    const layout = this.props.layout.data;
    if (this.props.layout.loading && !this.props.layout.data) {
      return (
        <View style={[styles.center, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    } else if (this.props.layout.data) {
      return (
        <ScrollView nestedScrollEnabled={true}>
          <View>
            <Slider
              autoplay
              autoplayLoop
              autoplayDelay={5}
              data={layout.banner}
              approxHeight={180}
            />
          </View>

          <SectonHeader
            title="Categories"
            titleEnd="View All"
            onPress={this.goTo}
            onPressArgs={['Category']}
          />

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={layout.categories}
            keyExtractor={this._categoryKeyExtractor}
            renderItem={CategoryItem}
            removeClippedSubviews={true}
          />

          {layout.featured_products && layout.featured_products.length > 0 && (
            <SectonHeader
              title="Featured"
              titleEnd="See More"
              style={{marginTop: 8}}
            />
          )}
          {layout.featured_products && layout.featured_products.length > 0 && (
            <ProductsRow
              keyPrefix="featured"
              products={layout.featured_products}
            />
          )}

          {layout.top_rated_products &&
            layout.top_rated_products.length > 0 && (
              <SectonHeader
                title="Top Rated"
                titleEnd="See More"
                style={{marginTop: 8}}
              />
            )}
          {layout.top_rated_products &&
            layout.top_rated_products.length > 0 && (
              <ProductsRow
                keyPrefix="toprated"
                products={layout.top_rated_products}
              />
            )}

          {layout.sale_products && layout.sale_products.length > 0 && (
            <SectonHeader
              title="Tranding Offers"
              titleEnd="See More"
              style={{marginTop: 8}}
            />
          )}
          {layout.sale_products && layout.sale_products.length > 0 && (
            <ProductsRow keyPrefix="sale" products={layout.sale_products} />
          )}

          {layout.top_seller && layout.top_seller.length > 0 && (
            <SectonHeader
              title="Top Sellers"
              titleEnd="See More"
              style={{marginTop: 8}}
            />
          )}
          {layout.top_seller && layout.top_seller.length > 0 && (
            <ProductsRow keyPrefix="topseller" products={layout.top_seller} />
          )}
        </ScrollView>
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    layout: state.homeLayout,
  };
};

const mapDispatchToProps = {
  getHomeLayout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
