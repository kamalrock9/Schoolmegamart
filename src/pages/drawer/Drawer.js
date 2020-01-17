import React from 'react';
import {NavigationActions} from 'react-navigation';
import {ScrollView, View, StyleSheet} from 'react-native';
import {Button, Text, Icon} from '../../components';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import Login from '../auth/Login';
import {getReadableVersion} from 'react-native-device-info';

class Drawer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
    };
  }

  openModal = () => {
    this.setState({isOpenModal: true});
  };

  closeModal = () => {
    this.setState({isOpenModal: false});
  };

  navigateToScreen = (route, param = {}) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params: param,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  render() {
    const {appSettings, t} = this.props;
    const {isOpenModal} = this.state;

    return (
      <>
        <View style={styles.container}>
          <View style={styles.header}>
            <Icon name="account-circle" type="MaterialCommunityIcons" style={{fontSize: 54}} />
            <Text style={{fontSize: 16}} onPress={this.openModal}>
              {t('LOGIN/REGISTER')}
            </Text>
          </View>
          <ScrollView>
            <Button style={styles.button} onPress={this.navigateToScreen('HomeStack')}>
              <Icon name="home" type="FontAwesome" style={styles.icon} />
              <Text style={styles.text}>{t('HOME')}</Text>
            </Button>

            <Button style={styles.button} onPress={this.navigateToScreen('ProductStack')}>
              <Icon name="shopping-bag" type="FontAwesome" style={styles.icon} />
              <Text style={styles.text}>{t('SHOP')}</Text>
            </Button>

            <Button style={styles.button} onPress={this.navigateToScreen('CategoryScreen')}>
              <Icon name="archive" type="Entypo" style={styles.icon} />
              <Text style={styles.text}>{t('CATEGORIES')}</Text>
            </Button>

            <View style={styles.divider} />
            {appSettings.hasOwnProperty('direct_tawk_id') && appSettings.direct_tawk_id != '' && (
              <Button
                style={styles.button}
                onPress={this.navigateToScreen('TawkToChat', {
                  uri: appSettings.direct_tawk_id,
                })}>
                <Icon name="chat" type="Entypo" style={styles.icon} />
                <Text style={styles.text}>{t('CHAT_SUPPORT')}</Text>
              </Button>
            )}
          </ScrollView>
          <View style={styles.footer}>
            <Text>{t('VERSION') + ' : ' + getReadableVersion()}</Text>
          </View>
        </View>
        <Modal
          isVisible={isOpenModal}
          style={{margin: 0}}
          useNativeDriver={true}
          onBackButtonPress={this.closeModal}>
          <Login onClose={this.closeModal} navigation={this.props.navigation} />
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    backgroundColor: '#dedede',
    height: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  icon: {
    color: '#777777',
    marginEnd: 16,
    marginStart: 12,
    fontSize: 24,
  },
  text: {
    color: '#000000',
    fontWeight: '500',
  },
  footer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingEnd: 16,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#dedede',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#dedede',
    justifyContent: 'center',
    height: 150,
  },
});

const mapStateToProps = state => ({
  appSettings: state.appSettings,
});
export default connect(mapStateToProps)(withTranslation()(Drawer));
