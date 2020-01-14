import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {saveAppSettings, getCartCount} from '../store/actions';
import {useSelector, useDispatch} from 'react-redux';
import {isEmpty} from 'lodash';
import Toast from 'react-native-simple-toast';
import {ApiClient} from '../service';

function Splash({navigation}) {
  const appSettings = useSelector(state => state.appSettings);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(appSettings)) {
      ApiClient.get('/app-settings')
        .then(({data}) => {
          dispatch(saveAppSettings(data));
          navigation.navigate('Drawer');
        })
        .catch(() => {
          Toast.show('Something went wrong! Try again');
        });
    } else {
      navigation.navigate('Drawer');
      ApiClient.get('/app-settings').then(({data}) => {
        dispatch(saveAppSettings(data));
      });
    }
    dispatch(getCartCount());
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icon/icon.png')}
        style={{width: 112, height: 112}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Splash;
