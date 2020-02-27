import React from 'react';
import {View, StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import {useSelector} from 'react-redux';
import {Text, Button, Icon} from '../../components';

function MiniCart({appSettings, close, message, navigation}) {
  const cartCount = useSelector(state => state.cartCount);

  goToHome = () => {
    close && close();
    navigation.navigate('HomeStack');
  };
  goToCart = () => {
    close && close();
    navigation.navigate('Cart');
  };

  return (
    // <View></View>
    <>
      <View style={styles.container}>
        <Button>
          <Icon name="md-checkmark" size={24} />
        </Button>
        <Text style={{color: '#000000', fontSize: 18}}>Added to cart</Text>
        <Button style={{marginLeft: 'auto'}} onPress={close}>
          <Icon name="md-close" size={24} />
        </Button>
      </View>
      <View style={styles.message}>
        <Text>{message}</Text>
      </View>
      <View style={{borderTopWidth: 0.8, borderTopColor: '#dedede'}}>
        <View style={{flexDirection: 'row', width: '100%'}}>
          <Button onPress={close} style={[styles.btn, {flex: 1}]}>
            <Text style={{fontWeight: '500'}}>CONTINUE BROWSING</Text>
          </Button>
          <View style={{width: 1, backgroundColor: '#dedede'}} />
          <Button onPress={goToHome} style={[styles.btn, {flex: 1}]}>
            <Text style={{fontWeight: '500'}}>GO TO HOME</Text>
          </Button>
        </View>
        <Button
          onPress={goToCart}
          style={[{backgroundColor: appSettings.accent_color}, styles.btn]}>
          <Text style={{color: 'white'}}>GO TO CART({cartCount})</Text>
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    borderWidth: 1,
    borderRadius: 1,
    borderStyle: 'dashed',
    borderColor: '#757575',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginHorizontal: 30,
  },
  btn: {
    //flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withNavigation(MiniCart);
