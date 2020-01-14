import React, {Component} from 'react';
import {FlatList} from 'react-native';
import ProductItem from '../pages/product/ProductItem';

class ProductsRow extends React.PureComponent {
  _renderFlatItem = ({item, index}) => {
    return (
      <ProductItem
        item={item}
        width={150}
        containerStyle={
          index == 0 ? {marginStart: 12, marginEnd: 10} : {marginEnd: 10}
        }
      />
    );
  };
  _keyExtractor = (item, index) => this.props.keyPrefix + item.id;

  render() {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={this.props.products}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderFlatItem}
        initialNumToRender={5}
        windowSize={11}
        nestedScrollEnabled={true}
        removeClippedSubviews={true}
      />
    );
  }
}

export default ProductsRow;
