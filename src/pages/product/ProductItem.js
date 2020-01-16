import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
///import Image from '../../components/ScaledImage';
import FastImage from 'react-native-fast-image';
import {Html, Text, WishlistIcon} from '../../components';
import StarRating from 'react-native-star-rating';

class ProductItem extends React.PureComponent {
  goToProductDetails = () => {
    this.props.navigation.push('ProductDetailScreen', this.props.item);
  };

  render() {
    const {containerStyle, width, item, appSettings} = this.props;
    return (
      <TouchableWithoutFeedback onPress={this.goToProductDetails}>
        <View
          style={[
            StyleSheet.flatten(containerStyle),
            styles.container,
            {width},
          ]}>
          {item.images.length > 0 && (
            <FastImage
              style={styles.thumb}
              source={{uri: item.images[0].src}}
            />
          )}
          <Text style={[styles.itemMargin, {fontWeight: '600'}]}>
            {item.name}
          </Text>

          {item.price_html != '' && (
            <Html html={item.price_html} containerStyle={styles.itemMargin} />
          )}

          <StarRating
            disabled
            maxStars={5}
            rating={parseInt(item.average_rating)}
            containerStyle={[styles.itemMargin, styles.star]}
            starStyle={{marginEnd: 5}}
            starSize={14}
            halfStarEnabled
            emptyStarColor={appSettings.accent_color}
            fullStarColor={appSettings.accent_color}
            halfStarColor={appSettings.accent_color}
          />
          <WishlistIcon style={styles.right} item={item} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

mapStateToProps = state => ({
  appSettings: state.appSettings,
});

export default connect(mapStateToProps)(withNavigation(ProductItem));

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#bdbdbd',
    flex: 1,
    paddingBottom: 8,
  },
  thumb: {
    flex: 1,
    resizeMode: 'contain',
    height: 180,
  },
  star: {
    justifyContent: 'flex-start',
  },
  itemMargin: {
    marginStart: 8,
    marginTop: 4,
  },
  right: {
    position: 'absolute',
    end: 0,
    top: 0,
  },
});
