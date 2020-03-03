import React, {Component} from 'react';
import {FlatList} from 'react-native';
import ProductItem from './ProductItem';

const _renderFlatItem = ({item, index}) => {
  return (
    <ProductItem
      item={item}
      width={150}
      containerStyle={index == 0 ? {marginStart: 12, marginEnd: 10} : {marginEnd: 10}}
    />
  );
};

function ProductsRow({products, keyPrefix}) {
  const _keyExtractor = (item, index) => keyPrefix + item.id;

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={products}
      keyExtractor={_keyExtractor}
      renderItem={_renderFlatItem}
      initialNumToRender={5}
      nestedScrollEnabled={true}
    />
  );
}

export default ProductsRow;
