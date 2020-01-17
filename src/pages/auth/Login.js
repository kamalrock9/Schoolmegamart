import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {Icon, Text, Button} from '../../components';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {withTranslation} from 'react-i18next';
import Constants from '../../service/Config';

class Auth extends Component {
  render() {
    const {onClose, t} = this.props;
    return (
      <ImageBackground
        source={require('../../assets/imgs/login-background.jpg')}
        style={styles.container}>
        <Button style={{padding: 8, alignSelf: 'flex-start'}} onPress={onClose}>
          <Icon name="close" size={24} color="#FFF" type="MaterialCommunityIcons" />
        </Button>
        <SwiperFlatList>
          <View style={styles.slide1}>
            <Text style={styles.title}>{t('WELCOME_TO_WOOAPP', {value: Constants.storeName})}</Text>
            <Text style={styles.subtitle}>{t('FASHION_INFO')}</Text>
            <View style={{width: '100%', flexDirection: 'row'}}></View>
          </View>
        </SwiperFlatList>
      </ImageBackground>
    );
  }
}
export default withTranslation()(Auth);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide1: {
    flex: 1,
    padding: 8,
  },
  title: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 18,
  },
  subtitle: {
    color: '#FFF',
    marginTop: 4,
    fontSize: 13,
  },
});
