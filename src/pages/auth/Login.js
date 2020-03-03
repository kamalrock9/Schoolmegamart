import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground, Dimensions, ActivityIndicator} from 'react-native';
import {Icon, Text, Button, FloatingTextinput} from '../../components';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import Constants from '../../service/Config';
import {ApiClient} from '../../service';
import {user} from '../../store/actions';

const {width} = Dimensions.get('window');

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginEmail: '',
      loginPassword: '',
      loading: false,
    };
  }

  update = key => value => [
    this.setState({
      [key]: value,
    }),
  ];

  _login = () => {
    const {loginEmail, loginPassword} = this.state;
    let param = {
      email: loginEmail,
      password: loginPassword,
    };
    this.setState({loading: true});
    ApiClient.post('/login', param)
      .then(({data}) => {
        console.log(data);
        this.setState({loading: false});
        if (data.code == 1) {
          this.props.user(data.details);
        }
      })
      .catch(error => {
        this.setState({loading: false});
      });
  };

  navigateToScreen = () => {
    console.log('kamal');
    this.props.navigation.navigate('Signup');
  };

  render() {
    const {onClose, t} = this.props;
    const {loginEmail, loginPassword, loading} = this.state;
    return (
      <ImageBackground
        source={require('../../assets/imgs/login-background.jpg')}
        style={styles.container}>
        <Button style={{padding: 8, alignSelf: 'flex-start'}} onPress={onClose}>
          <Icon name="close" size={24} color="#FFF" type="MaterialCommunityIcons" />
        </Button>
        {!loading ? (
          <SwiperFlatList>
            <View style={styles.slide1}>
              <Text style={styles.title}>
                {t('WELCOME_TO_WOOAPP', {value: Constants.storeName})}
              </Text>
              <Text style={styles.subtitle}>{t('FASHION_INFO')}</Text>
              <View style={{width: '100%', flexDirection: 'row', marginTop: 20}}>
                <Button style={[styles.socialBtn, {flex: 1, marginEnd: 8}]}>
                  <Icon name="logo-facebook" size={20} color="#FFF" />
                  <Text style={[styles.socialBtnText, {marginStart: 8}]}>Facebook</Text>
                </Button>
                <Button style={[styles.socialBtn, {flex: 1, marginStart: 8}]}>
                  <Icon name="logo-google" size={20} color="#FFF" />
                  <Text style={[styles.socialBtnText, {marginStart: 8}]}>Google</Text>
                </Button>
              </View>
              <View style={{width: '100%', flexDirection: 'row', marginVertical: 30}}>
                <View style={styles.line} />
                <Text style={styles.or}>Or login via e-mail</Text>
                <View style={styles.line} />
              </View>

              <FloatingTextinput
                label={t('EMAIL')}
                labelColor="#FFFFFF"
                style={{color: '#FFFFFF'}}
                value={loginEmail}
                onChangeText={this.update('loginEmail')}
              />
              <View style={{marginTop: 10}}>
                <FloatingTextinput
                  secureTextEntry={true}
                  label={t('PASSWORD')}
                  labelColor="#FFFFFF"
                  style={{color: '#FFFFFF'}}
                  value={loginPassword}
                  onChangeText={this.update('loginPassword')}
                />
              </View>
              <Button style={{alignSelf: 'flex-end', marginTop: 16, paddingVertical: 8}}>
                <Text style={styles.socialBtnText}>Forget Password</Text>
              </Button>

              <Button style={styles.btn} onPress={this._login}>
                <Text style={styles.btnText}>Sign In</Text>
              </Button>
              <View
                style={{width: '100%', flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
                <Text style={styles.socialBtnText}>Don't have an account? </Text>
                <Button
                  style={[styles.socialBtn, {paddingHorizontal: 8, marginStart: 8}]}
                  onPress={this.navigateToScreen}>
                  <Text style={styles.socialBtnText}>Sign Up</Text>
                </Button>
              </View>
            </View>
          </SwiperFlatList>
        ) : (
          <ActivityIndicator style={{alignSelf: 'center'}} />
        )}
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = {
  user,
};

export default connect(null, mapDispatchToProps)(withTranslation()(Auth));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  slide1: {
    flex: 1,
    width,
    padding: 16,
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
  socialBtn: {
    flexDirection: 'row',
    borderColor: '#FFFFFF',
    borderRadius: 2,
    borderWidth: 1,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: {
    color: '#FFF',
    fontSize: 12,
  },
  line: {
    flex: 1,
    alignSelf: 'center',
    height: 1,
    backgroundColor: '#FFF',
  },
  or: {
    color: '#FFF',
    paddingHorizontal: 8,
    fontSize: 12,
  },
  btn: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 2,
    justifyContent: 'center',
  },
  btnText: {
    fontWeight: '600',
  },
});
