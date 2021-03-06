import React, {Component} from "react";
import {View, StyleSheet, ActivityIndicator} from "react-native";
import {_} from "lodash";
import Toast from "react-native-simple-toast";
import {Button, Text, Toolbar} from "components";
import {ApiClient} from "service";
import {connect} from "react-redux";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import {user} from "store/actions";
import axios from "axios";
import analytics from "@react-native-firebase/analytics";

class ForgetPasswordOTPVerify extends Component {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    const data = this.props.navigation.state.params;

    this.state = {
      loading: false,
      timer: null,
      counter: 0,
      code: "",
      phone: data.phone,
      country_code: data.country_code,
    };
  }

  componentDidMount() {
    this.trackScreenView("Forget Password OTP");
    let timer = setInterval(this.tick, 1000);
    this.setState({timer, counter: 30});
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  tick = () => {
    if (this.state.counter < 0) {
      clearInterval(this.state.timer);
    } else {
      this.setState({
        counter: this.state.counter - 1,
      });
    }
  };

  resendOTP = () => {
    this.setState({loading: true});
    ApiClient.get(
      "/sendOTP/?phone=" + this.state.phone + "&country_code=+" + this.state.country_code,
    )
      .then(({data}) => {
        if (data.type == "failed") {
          Toast.show(data.message, Toast.LONG);
          this.setState({loading: false});
        } else {
          Toast.show("OTP has been send", Toast.LONG);
          let timer = setInterval(this.tick, 1000);
          this.setState({loading: false, code: "", timer, counter: 30});
        }
      })
      .catch(() => {
        this.setState({loading: false});
      });
  };
  verifyOTP = () => {
    const {Token} = this.props.navigation.state.params;
    var bodyFormData = new FormData();
    bodyFormData.append("otp", this.state.code);
    bodyFormData.append("token", Token);
    console.log(bodyFormData);
    this.setState({loading: true});
    axios
      .post("https://schoolmegamart.com/wp-json/wc/v2/forget-passowrd/app/verify-otp", bodyFormData)
      .then(({data}) => {
        this.setState({loading: true});
        console.log(data);
        if (data.status) {
          this.props.navigation.navigate("NewPassword", {Token: data.token});
        }
      })
      .catch(() => {
        this.setState({loading: false});
      });
  };

  navigateToScreen = (route, params = {}) => () => {
    this.props.navigation.navigate(route, params);
  };

  render() {
    const {appSettings} = this.props;
    return (
      <View style={{alignItems: "center"}}>
        <Toolbar title="OTP Verify Screen" backButton />
        <Text style={{fontWeight: "700", fontSize: 18, marginTop: 100}}>We sent you a code to</Text>
        <Text style={{fontWeight: "700", fontSize: 18}}>Verify your Email</Text>

        <SmoothPinCodeInput
          value={this.state.code}
          containerStyle={{marginTop: 40}}
          onTextChange={code => this.setState({code})}
          restrictToNumbers
          codeLength={6}
          cellStyle={styles.pinCodeCell}
          cellStyleFocused={{borderWidth: 1}}
        />

        <View style={styles.rensendContainer}>
          <Text>Didn't recieve?</Text>
          {this.state.counter > 0 ? (
            <Text style={{color: "#F79221", fontWeight: "600"}}>
              {" "}
              Resend ({this.state.counter})
            </Text>
          ) : (
            <Button onPress={this.resendOTP}>
              <Text style={{color: "#F79221", fontWeight: "600"}}> Resend</Text>
            </Button>
          )}
        </View>

        <Button
          onPress={this.verifyOTP}
          containerStyle={{marginTop: 30}}
          style={[styles.btn, {backgroundColor: appSettings.accent_color}]}>
          <Text style={{fontWeight: "600", fontSize: 16, color: "#ffffff"}}>Next</Text>
        </Button>
        {this.state.loading && <ActivityIndicator />}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  appSettings: state.appSettings,
});
const mapDispatchToProps = {
  user,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgetPasswordOTPVerify);

const styles = StyleSheet.create({
  pinCodeCell: {
    borderRadius: 4,
    elevation: 1,
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {height: 1, width: 0},
    borderWidth: 0,
    borderColor: "#92CE00",
    backgroundColor: "#FFFFFF",
  },
  rensendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  btn: {
    height: 48,
    paddingVertical: 8,
    paddingHorizontal: 45,
    justifyContent: "center",
    backgroundColor: "red",
    marginTop: 16,
    borderRadius: 4,
    height: 40,
  },
});
