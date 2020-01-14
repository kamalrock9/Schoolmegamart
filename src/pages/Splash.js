import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import {appSettings, getCartCount} from '../../store/actions';
import {Toast, Root} from 'native-base';
import {connect} from 'react-redux';
import {getAppSettings} from '../../rest';

class Splash extends React.PureComponent {
  constructor(props) {
    super(props);
    getAppSettings()
      .then(response => {
        this.props.appSettings(response);
        this.props.navigation.navigate('Drawer');
      })
      .catch(error => {
        Toast.show({
          text: 'Something Went wrong! Try Later',
          duration: 6000,
        });
      });
    this.props.getCartCount();
  }

  render() {
    return (
      <Root>
        <View style={styles.container}>
          <Image
            source={require('../assets/icon/icon.png')}
            style={{width: 112, height: 112}}
          />
        </View>
      </Root>
    );
  }
}

const mapDispatchToProps = {
  appSettings,
  getCartCount,
};

export default connect(null, mapDispatchToProps)(Splash);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
