import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import Image from './ScaledImage';
import Html from './Html';
import StarRating from 'react-native-star-rating';
import Text from './Text';
import WishlistIcon from './WishlistIcon';

class ProductItem extends React.PureComponent {
  _navigateToProductDetail = () => {
    this.props.navigation.push('ProductDetails', this.props.item);
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this._navigateToProductDetail}>
        <View
          style={{
            ...StyleSheet.flatten(this.props.containerStyle),
            borderRadius: 3,
            borderWidth: 0.5,
            borderColor: '#bdbdbd',
            width: this.props.width,
          }}>
          {this.props.item.images.length > 0 && (
            <Image
              width={this.props.width}
              source={{uri: this.props.item.images[0].src}}
            />
          )}
          <Text style={[styles.itemMargin, {fontWeight: '700'}]}>
            {this.props.item.name}
          </Text>

          {this.props.item.price_html != '' && (
            <Html
              html={this.props.item.price_html}
              containerStyle={styles.itemMargin}
            />
          )}

          <StarRating
            disabled
            maxStars={5}
            rating={parseInt(this.props.item.average_rating)}
            containerStyle={[
              styles.itemMargin,
              {justifyContent: 'flex-start', marginBottom: 5},
            ]}
            starStyle={{marginEnd: 5}}
            starSize={14}
            halfStarEnabled
            emptyStarColor={this.props.appSettings.accent_color}
            fullStarColor={this.props.appSettings.accent_color}
            halfStarColor={this.props.appSettings.accent_color}
          />

          <WishlistIcon style={styles.right} item={this.props.item} />
          {/* <Button transparent style={styles.right}>
                    <Icon name="ios-heart" style={{
                        color: this.props.appSettings.accent_color,
                        marginStart: 8,
                        marginEnd: 8
                    }} />
                </Button> */}
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
  itemMargin: {
    marginStart: 5,
    marginTop: 4,
  },
  right: {
    position: 'absolute',
    end: 0,
    top: 0,
  },
});
