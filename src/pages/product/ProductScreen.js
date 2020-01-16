import React from 'react';
import {View, FlatList, StyleSheet, Dimensions} from 'react-native';
import {FlatListLoading, Toolbar} from '../../components';
import Toast from 'react-native-simple-toast';
import ProductItem from './ProductItem';
import {ApiClient} from '../../service';
import {FlatGrid} from 'react-native-super-grid';

const {width} = Dimensions.get('window');

class ProductScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      refreshing: true,
      flatListEndReached: false,
    };
    this.params = {
      page: 0,
      per_page: 20,
      sort: 'default',
    };
  }

  static navigationOptions = ({navigation}) => ({
    header: <Toolbar backButton />,
  });

  componentDidMount() {
    this.loadProducts();
  }

  loadProducts = () => {
    if (this.state.flatListEndReached) {
      return;
    }
    this.params.page++;
    ApiClient.get('custom-products', this.params)
      .then(({data}) => {
        this.setState({
          products: [...this.state.products, ...data],
          flatListEndReached: data.length < this.params.per_page,
          refreshing: false,
        });
      })
      .catch(e => {
        Toast.show(e.toString(), Toast.LONG);
      });
  };

  _renderItem = ({item, index}) => {
    return (
      /***** For providing dynamic width to scaledimages 
      {width - (MarginVertical of Container + borderWidth)}/2] ****/
      <ProductItem item={item} />
    );
  };
  _keyExtractor = (item, index) => item.name + item.id;

  render() {
    const {products, flatListEndReached, refreshing} = this.state;
    return (
      // <View style={styles.container}>
      <FlatGrid
        items={products}
        //keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        itemDimension={160}
        spacing={8}
        //numColumns={2}
        // style={{margin: 2}}
        onEndReached={this.loadProducts}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={!refreshing}
        ListFooterComponent={
          <FlatListLoading
            bottomIndicator={!flatListEndReached}
            centerIndicator={refreshing}
          />
        }
      />
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductScreen;
