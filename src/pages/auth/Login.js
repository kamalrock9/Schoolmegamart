import React, {useRef, useState, useEffect, useReducer} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {Icon, Text, Button} from "components";
import SwiperFlatList from "react-native-swiper-flatlist";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {ApiClient} from "service";
import {user, saveShipping} from "store/actions";
import {GoogleSignin} from "@react-native-community/google-signin";
import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from "react-native-fbsdk";
import {useSelector} from "react-redux";
import Toast from "react-native-toast-message";
import analytics from "@react-native-firebase/analytics";

const {width, height} = Dimensions.get("window");

const initialState = {
  loginEmail: "",
  loginPassword: "",
  firstname: "",
  lastname: "",
  signUpEmail: "",
  signUpPhone: "",
  password: "",
  confirmPassword: "",
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "changeEmail":
      return {...state, loginEmail: action.payload};
    case "changePassword":
      return {...state, loginPassword: action.payload};
    case "changeFirstname":
      return {...state, firstname: action.payload};
    case "changeLastname":
      return {...state, lastname: action.payload};
    case "changeSignupEmail":
      return {...state, signUpEmail: action.payload};
    case "changePasswordSignup":
      return {...state, password: action.payload};
    case "changeConfirmPassword":
      return {...state, confirmPassword: action.payload};
    case "changeSignupPhone":
      return {...state, signUpPhone: action.payload};
    case "changeCouponCode":
      return {...state, couponcode: action.payload};
    default:
      return state;
  }
}

function Auth({navigation}) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedReg, setCheckedReg] = useState(false);
  const {NeedLogin, NeedRegister} = navigation.state.params;
  console.log(NeedRegister);
  const {t} = useTranslation();
  const dispatchAction = useDispatch();
  const {accent_color} = useSelector(state => state.appSettings);
  const [state, dispatch] = useReducer(reducer, initialState);
  const scrollRef = useRef(null);

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  if (NeedRegister) {
    console.log("Reg");
    goToLastIndex;
  }

  const error = {
    type: "error",
    position: "bottom",
    text1: "Error",
    text2: "Please enter the correct email address.",
  };

  const goToFirstIndex = () => {
    scrollRef.current.goToFirstIndex();
  };

  const goToLastIndex = () => {
    scrollRef.current.goToLastIndex();
  };

  const goback = () => {
    if (NeedLogin) {
      navigation.goBack();
    }
  };

  ///Login//
  const onChangeEmail = text => {
    dispatch({type: "changeEmail", payload: text});
  };
  const onChangePassword = text => {
    dispatch({type: "changePassword", payload: text});
  };

  //signup//
  const onChangeFirstname = text => {
    dispatch({type: "changeFirstname", payload: text});
  };

  const onChangeSignupEmail = text => {
    dispatch({type: "changeSignupEmail", payload: text});
  };

  const onChangeSignupPhone = text => {
    dispatch({type: "changeSignupPhone", payload: text});
  };

  const onChangepassword = text => {
    dispatch({type: "changePasswordSignup", payload: text});
  };

  const onChangeCouponCode = text => {
    dispatch({type: "changeCouponCode", payload: text});
  };

  const socialLogin = social => () => {
    if (social == "google") {
      GoogleSignin.configure();
      GoogleSignin.hasPlayServices();
      setLoading(true);
      GoogleSignin.signIn()
        .then(res => {
          console.log(res);
          //Alert.alert(JSON.stringify(res.user));
          let newData = {
            email: res.user.email,
            mode: "google",
          };
          let details = newData;
          console.log(details);
          // details.mode = "google";
          ApiClient.post("/social-login", details).then(({data}) => {
            console.log(data);
            setLoading(false);
            if (data.code == 1) {
              if (data.details != "") {
                saveDetails(data.details);
                //  onClose && onClose();
                if (NeedLogin) {
                  navigation.goBack();
                }
                Toast.show({
                  type: "success",
                  position: "bottom",
                  text1: "Success",
                  text2: "Login Successfully.",
                  visibilityTime: 2000,
                });
              } else {
                Toast.show({
                  type: "error",
                  position: "bottom",
                  text1: "Error",
                  text2: "Something went wrong.",
                });
                GoogleSignin.signOut();
              }
            } else {
              Toast.show({
                type: "error",
                position: "bottom",
                text1: "Error",
                text2: "Wrong Email / Password.",
              });
            }
          });
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } else {
      // if (Platform.OS === "android") {
      //   LoginManager.setLoginBehavior("web_only");
      // }
      LoginManager.logInWithPermissions(["public_profile", "email"]).then(result => {
        if (result.isCancelled) {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: "Error",
            text2: "Login cancelled.",
          });
        } else {
          setLoading(true);
          AccessToken.getCurrentAccessToken()
            .then(data => {
              const infoRequest = new GraphRequest(
                "/me?fields=id,first_name,last_name,email,name",
                {accessToken: data.accessToken},
                (error, result) => {
                  if (error) {
                    setLoading(false);
                    //Toast.show(error.toString(), Toast.LONG);
                    //  console.log(error);
                  } else {
                    let details = result;
                    details.mode = "facebook";
                    setLoading(true);
                    ApiClient.post("/social-login", details).then(({data}) => {
                      console.log(data);
                      setLoading(false);
                      if (data.code == 1) {
                        saveDetails(data.details);
                        //onClose && onClose();
                        if (NeedLogin) {
                          navigation.goBack(null);
                        }
                        Toast.show({
                          type: "success",
                          position: "bottom",
                          text1: "Success",
                          text2: "Login Successfully.",
                          visibilityTime: 2000,
                        });
                      } else {
                        Toast.show({
                          type: "error",
                          position: "bottom",
                          text1: "Error",
                          text2: "Wrong Email / Password.",
                        });
                      }
                    });
                  }
                },
              );
              new GraphRequestManager().addRequest(infoRequest).start();
            })
            .then(error => {
              setLoading(false);
            });
        }
      });
    }
  };

  const _login = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let param = {
      email: state.loginEmail,
      password: state.loginPassword,
    };
    if (state.loginEmail != "" && state.loginPassword != "") {
      if (reg.test(state.loginEmail) === true) {
        setLoading(true);
        ApiClient.post("/login", param)
          .then(({data}) => {
            console.log(data);
            setLoading(false);
            if (data.code == 1) {
              saveDetails(data.details);
              // onClose && onClose();
              Toast.show({
                type: "success",
                position: "bottom",
                text1: "Success",
                text2: "Login Successfully.",
                visibilityTime: 2000,
              });

              if (NeedLogin) {
                navigation.goBack(null);
                // navigation.replace("AccountSetting");
              }
            } else {
              Toast.show({
                type: "error",
                position: "bottom",
                text1: "Error",
                visibilityTime: 4000,
                text2: data.message,
              });
            }
          })
          .catch(error => {
            setLoading(false);
          });
      } else {
        Toast.show(error);
      }
    } else {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2: "Please fill all the details.",
        visibilityTime: 4000,
      });
    }
  };

  const gotoPassword = () => {
    navigation.navigate("ForgetPassword");
  };

  const _register = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const verifyMob = /^[0]?[6789]\d{9}$/;
    var bodyFormData = new FormData();
    bodyFormData.append("fname", state.firstname);
    bodyFormData.append("lname", state.lastname);
    bodyFormData.append("email", state.signUpEmail);
    bodyFormData.append("password", state.password);

    if (state.firstname != "" && state.signUpEmail != "" && state.password != "") {
      if (reg.test(state.signUpEmail) === true) {
        if (verifyMob.test(state.signUpPhone) === true && state.signUpPhone.length == 10) {
          setLoading(true);
          ApiClient.post("/register", bodyFormData, {
            config: {headers: {"Content-Type": "multipart/form-data"}},
          })
            .then(({data}) => {
              console.log(data);
              setLoading(false);
              if (data.status == 1) {
                goToFirstIndex();
                if (state.couponcode != "") {
                  var param = new FormData();
                  param.append("user_id", data.details.id);
                  param.append("refer_code", state.couponcode);
                  console.log(param);
                  ApiClient.post("/referapply", param)
                    .then(({data}) => {
                      console.log(data);
                      if (data.status) {
                        Toast.show({
                          type: "success",
                          position: "bottom",
                          text1: "Success",
                          text2: data.message,
                          visibilityTime: 2000,
                        });
                      } else {
                        Toast.show({
                          type: "error",
                          position: "bottom",
                          text1: "Error",
                          text2: data.message,
                          visibilityTime: 4000,
                        });
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
                }
              } else {
                setLoading(false);
                Toast.show({
                  type: "error",
                  position: "bottom",
                  text1: "Error",
                  text2: data.error,
                  visibilityTime: 4000,
                });
              }
            })
            .catch(error => {
              setLoading(false);
            });
        } else {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: "Error",
            text2: "Please enter the correct Mobile Number.",
            visibilityTime: 4000,
          });
        }
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error",
          text2: "Please enter the correct email address.",
          visibilityTime: 4000,
        });
      }
    } else {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2: "Please fill all the details.",
        visibilityTime: 4000,
      });
    }
  };

  const saveDetails = data => {
    dispatchAction(user(data));
    dispatchAction(
      saveShipping({
        city: data.shipping.city,
        postcode: data.shipping.postcode,
        country: data.shipping.country,
        state: data.shipping.state,
      }),
    );
  };

  const navigateToScreen = key => () => {
    navigation.navigate("PostRegisterOTP", {key: key});
  };

  const _onCheck = () => {
    setChecked(!checked);
  };

  const _onCheckReg = () => {
    setCheckedReg(!checkedReg);
  };

  return (
    <View style={{flex: 1, backgroundColor: "#F9FAFC"}}>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <Button style={{padding: 8, alignSelf: "flex-start"}} onPress={goback}>
          <Icon name="close" size={24} color="#000" type="MaterialCommunityIcons" />
        </Button>

        <Image
          source={require("../../assets/imgs/containerLogo.png")}
          style={{
            width: 220,
            height: 220,
            resizeMode: "contain",
            position: "absolute",
            right: 0,
            marginRight: -50,
            marginTop: -50,
          }}
        />
      </View>
      <View style={styles.container}>
        <SwiperFlatList ref={scrollRef}>
          <ScrollView
            contentContainerStyle={{
              height: height,
              width: width,
              paddingEnd: 16,
              paddingStart: 16,
            }}
            showsVerticalScrollIndicator={false}>
            {/* <View style={styles.slide1}> */}
            <Text style={styles.title}>Hello</Text>
            <Text style={styles.subtitle}>Sign in your account</Text>
            <View style={{width: "100%", flexDirection: "row", marginTop: 20}}>
              <Button
                style={[styles.socialBtn, {flex: 1, marginEnd: 8}]}
                onPress={socialLogin("facebook")}>
                <Image
                  source={require("../../assets/imgs/facebook.png")}
                  style={{width: 20, height: 20, resizeMode: "contain"}}
                />
                <Text style={[styles.socialBtnText, {marginStart: 8, fontWeight: "500"}]}>
                  FACEBOOK
                </Text>
              </Button>
              <Button
                style={[styles.socialBtn, {flex: 1, marginStart: 8}]}
                onPress={socialLogin("google")}>
                <Image
                  source={require("../../assets/imgs/google.png")}
                  style={{width: 20, height: 20, resizeMode: "contain"}}
                />
                <Text style={[styles.socialBtnText, {marginStart: 8, fontWeight: "500"}]}>
                  GOOGLE
                </Text>
              </Button>
            </View>
            <View style={{width: "100%", flexDirection: "row", marginVertical: 30}}>
              <View style={styles.line} />
              <Text style={styles.or}>{t("LOGIN_METHODS")}</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.textinputview}>
              <Image
                style={{width: 16, height: 16, marginHorizontal: 12}}
                source={require("../../assets/imgs/user.png")}
              />

              <TextInput
                caretHidden={true}
                placeholder="Email"
                style={[styles.textinput, {marginTop: 3}]}
                value={state.loginEmail}
                onChangeText={onChangeEmail}
              />
            </View>

            <View style={[styles.textinputview, {marginTop: 20}]}>
              <Image
                style={{resizeMode: "contain", width: 16, height: 16, marginHorizontal: 12}}
                source={require("../../assets/imgs/key.png")}
              />
              <TextInput
                secureTextEntry={!checked}
                placeholder="Password"
                style={[styles.textinput]}
                value={state.loginPassword}
                onChangeText={onChangePassword}
              />
            </View>
            <TouchableOpacity
              style={{flexDirection: "row", alignItems: "center", marginTop: 8}}
              onPress={_onCheck}>
              <Icon
                type="MaterialCommunityIcons"
                color={checked ? accent_color : "grey"}
                size={24}
                name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
              />
              <Text style={{color: "grey", marginStart: 8}}>Show Password</Text>
            </TouchableOpacity>

            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <Button
                style={{alignSelf: "flex-end", marginTop: 16, paddingVertical: 8}}
                onPress={navigateToScreen("Login")}>
                <Text style={[styles.socialBtnText, {color: "#F47C20"}]}>Login with OTP</Text>
              </Button>
              <Button
                style={{alignSelf: "flex-end", marginTop: 16, paddingVertical: 8}}
                onPress={gotoPassword}>
                <Text style={[styles.socialBtnText, {color: "#F47C20"}]}>{t("FORGOT")}</Text>
              </Button>
            </View>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: 20,
              }}
              onPress={_login}>
              <Text style={[styles.btnText, {color: "#000", marginRight: 8}]}>{t("SIGN_IN")}</Text>

              <TouchableOpacity onPress={_login}>
                <Image
                  source={require("../../assets/imgs/signIn.png")}
                  style={{width: 60, resizeMode: "contain"}}
                />
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: "100%",
                flexDirection: "row",
                marginTop: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={goToLastIndex}>
              <Text style={styles.socialBtnText}>{t("DONT_HAVE_ACCOUNT")}</Text>
              <Button style={{paddingHorizontal: 8, marginStart: 2}} onPress={goToLastIndex}>
                <Text style={[styles.socialBtnText, {fontWeight: "600", color: "#F47C20"}]}>
                  Create
                </Text>
              </Button>
            </TouchableOpacity>
            {loading && (
              <ActivityIndicator
                color={accent_color}
                size="large"
                style={{alignItems: "center", justifyContent: "center"}}
              />
            )}
          </ScrollView>
          <ScrollView
            contentContainerStyle={{
              height: height + height / 6,
              width: width,
              paddingEnd: 16,
              paddingStart: 16,
            }}
            showsVerticalScrollIndicator={false}>
            {/* <View style={styles.slide1}> */}
            <Text style={[styles.title, {fontSize: 18, marginVertical: 30}]}>Create Account</Text>

            <View style={styles.textinputview}>
              <Image
                style={{width: 16, height: 16, marginHorizontal: 12}}
                source={require("../../assets/imgs/user.png")}
              />

              <TextInput
                placeholder="Name"
                style={[styles.textinput]}
                value={state.firstname}
                onChangeText={onChangeFirstname}
              />
            </View>

            <View style={[styles.textinputview, {marginTop: 20}]}>
              <Image
                style={{resizeMode: "contain", width: 16, height: 16, marginHorizontal: 12}}
                source={require("../../assets/imgs/key.png")}
              />

              <TextInput
                secureTextEntry={!checkedReg}
                placeholder="Password"
                style={[styles.textinput]}
                value={state.password}
                onChangeText={onChangepassword}
              />
            </View>

            <View style={[styles.textinputview, {marginTop: 20}]}>
              <Image
                style={{resizeMode: "contain", width: 16, height: 16, marginHorizontal: 12}}
                source={require("../../assets/imgs/email.png")}
              />

              <TextInput
                caretHidden={true}
                placeholder="Email"
                style={[styles.textinput]}
                value={state.signUpEmail}
                onChangeText={onChangeSignupEmail}
              />
            </View>

            <View style={[styles.textinputview, {marginTop: 20}]}>
              <Image
                style={{resizeMode: "contain", width: 16, height: 16, marginHorizontal: 12}}
                source={require("../../assets/imgs/phone.png")}
              />

              <TextInput
                keyboardType="numeric"
                placeholder="Phone"
                style={[styles.textinput]}
                value={state.signUpPhone}
                onChangeText={onChangeSignupPhone}
              />
            </View>

            <View style={[styles.textinputview, {marginTop: 20}]}>
              <Image
                style={{resizeMode: "contain", width: 16, height: 16, marginHorizontal: 12}}
                source={require("../../assets/imgs/refer.png")}
              />

              <TextInput
                placeholder="Coupon Code (optional)"
                style={[styles.textinput]}
                value={state.couponcode}
                onChangeText={onChangeCouponCode}
              />
            </View>
            <TouchableOpacity
              style={{flexDirection: "row", alignItems: "center", marginTop: 8}}
              onPress={_onCheckReg}>
              <Icon
                type="MaterialCommunityIcons"
                color={checkedReg ? accent_color : "grey"}
                size={24}
                name={checkedReg ? "checkbox-marked" : "checkbox-blank-outline"}
              />
              <Text style={{color: "grey", marginStart: 8}}>Show Password</Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
              }}>
              <Button
                style={{alignSelf: "flex-end", marginTop: 16, paddingVertical: 8}}
                onPress={navigateToScreen("Register")}>
                <Text style={[styles.socialBtnText, {color: "#F47C20"}]}>Register with OTP</Text>
              </Button>
              <TouchableOpacity
                style={{flexDirection: "row", alignItems: "center"}}
                onPress={_register}>
                <Text style={[styles.btnText, {color: "#000", marginRight: 8}]}>Create</Text>

                <TouchableOpacity onPress={_register}>
                  <Image
                    source={require("../../assets/imgs/signIn.png")}
                    style={{width: 60, resizeMode: "contain"}}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            <Text
              style={[styles.socialBtnText, {marginTop: 15, alignSelf: "center", marginTop: 50}]}>
              or create account using social media
            </Text>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "center",
              }}>
              <Button style={styles.socialLoginRoundButton} onPress={socialLogin("facebook")}>
                <Image
                  source={require("../../assets/imgs/facebook.png")}
                  style={{width: 20, height: 20, resizeMode: "contain"}}
                />
              </Button>
              <Button
                style={[styles.socialLoginRoundButton, {marginStart: 10}]}
                onPress={socialLogin("google")}>
                <Image
                  source={require("../../assets/imgs/google.png")}
                  style={{width: 20, height: 20, resizeMode: "contain"}}
                />
              </Button>
            </View>

            <TouchableOpacity
              style={{
                width: "100%",
                flexDirection: "row",
                marginTop: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={goToFirstIndex}>
              <Text style={styles.socialBtnText}>{t("HAVE_AN_ACCOUNT")}</Text>

              <Button style={{paddingHorizontal: 8, marginStart: 8}} onPress={goToFirstIndex}>
                <Text style={[styles.socialBtnText, {fontWeight: "600", color: "#F47C20"}]}>
                  {t("SIGN_IN")}
                </Text>
              </Button>
            </TouchableOpacity>
            {/* </View> */}
            {loading && (
              <ActivityIndicator
                color={accent_color}
                size="large"
                style={{alignItems: "center", justifyContent: "center"}}
              />
            )}
          </ScrollView>
        </SwiperFlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginTop: 60,
  },
  slide1: {
    flex: 1,
    width,
    padding: 16,
  },
  title: {
    color: "#000",
    fontWeight: "500",
    fontSize: 52,
    alignSelf: "center",
  },
  subtitle: {
    color: "#000",
    marginTop: 4,
    fontSize: 13,
    alignSelf: "center",
    fontWeight: "600",
  },
  socialBtn: {
    flexDirection: "row",
    borderRadius: 4,
    height: 36,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 2,
  },
  socialBtnText: {
    color: "#000",
    fontSize: 12,
  },
  line: {
    flex: 1,
    alignSelf: "center",
    height: 1,
    backgroundColor: "#000",
  },
  or: {
    color: "#000",
    paddingHorizontal: 8,
    fontSize: 12,
  },
  btn: {
    backgroundColor: "#F47C20",
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 2,
    justifyContent: "center",
  },
  btnText: {
    fontWeight: "600",
    color: "#fff",
  },
  textinput: {
    paddingVertical: 6,
    borderRadius: 2,
    paddingStart: 8,
    flex: 1,
  },
  textinputview: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    backgroundColor: "#fff",
    elevation: 2,
    borderRadius: 4,
  },
  socialLoginRoundButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginEnd: 8,
    elevation: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Auth;
