import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Linking,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import {Button, Text, Icon} from "components";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import Modal from "react-native-modal";
import Login from "../auth/Login";
import {getVersion} from "react-native-device-info";
import {isEmpty} from "lodash";
import {logout} from "store/actions";
import {ApiClient} from "service";
import {GoogleSignin} from "@react-native-community/google-signin";
import {LoginManager} from "react-native-fbsdk";
import {
  SvgHome,
  SvgShop,
  SvgCategories,
  SvgOrder,
  SvgCoupon,
  SvgAccount,
  SvgManageAddress,
  SvgNotification,
  SvgWishList,
  SvgDownload,
  SvgContactus,
  SvgTOS,
  SvgFeedback,
  SvgWallet,
  SvgLogout,
  SvgChat
} from "../../assets/svgs";

class Drawer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      isContactModalOpen: false,
    };
  }

  openModal = () => {
    //this.setState({isOpenModal: true});
    this.props.navigation.navigate("Auth", {NeedLogin: true, NeedRegister: false});
  };

  closeModal = () => {
    this.setState({isOpenModal: false});
  };

  toggleContactModal = () => {
    this.setState({isContactModalOpen: !this.state.isContactModalOpen});
  };

  navigateToScreen = (route, param = {}) => () => {
    const {navigation} = this.props;
    switch (route) {
      case "giveFeedback":
        Alert.alert(
          "Do you like using School Megamart?",
          null,
          [
            {text: "NOT REALLY", onPress: () => console.log("Cancel Pressed"), style: "cancel"},
            {
              text: "YES!",
              onPress: () => {
                if (Platform.OS != "ios") {
                  Linking.openURL(`market://details?id=${"com.in.schoolmegamart"}`).catch(err =>
                    alert("Please check for the Google Play Store"),
                  );
                } else {
                  Linking.openURL(
                    `itms://itunes.apple.com/in/app/apple-store/${com.in.schoolmegamart}`,
                  ).catch(err => alert("Please check for the App Store"));
                }
              },
            },
          ],
          {cancelable: false},
        );
        break;
      case "Logout":
        ApiClient.get("/logout?user_id=" + this.props.user.id)
          .then(res => {
            console.log(res);
          })
          .catch(error => {
            console.log(error);
          });
        this.props.logout();
        GoogleSignin.signOut();
        LoginManager.logOut();
        navigation.navigate("Home");
        navigation.closeDrawer();
        break;
      default:
        navigation.closeDrawer();
        navigation.navigate(route, param);
        break;
    }
  };

  contactUs = async () => {
    await this.props.navigation.closeDrawer();
    this.toggleContactModal();
  };

  render() {
    const {
      appSettings: {wallet_active, direct_tawk_id, primary_color, accent_color},
      t,
      user,
    } = this.props;
    const {isOpenModal, isContactModalOpen} = this.state;

    return (
      <>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              style={{width: 60, height: 60, marginEnd: 10, borderRadius: 30}}
              source={{
                uri: user.avatar_url
                  ? user.avatar_url
                  : "https://st.depositphotos.com/1779253/5140/v/600/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg",
              }}
            />
            {/* <Icon
              name="account-circle"
              type="MaterialCommunityIcons"
              style={{fontSize: 54, marginEnd: 10}}
            /> */}
            {isEmpty(user) ? (
              <Text style={{fontSize: 16, fontWeight: "500"}} onPress={this.openModal}>
                {t("LOGIN/REGISTER")}
              </Text>
            ) : (
              <TouchableOpacity onPress={this.navigateToScreen("AccountSetting")}>
                <Text style={{fontSize: 16, fontWeight: "500"}}>
                  {user.first_name && user.last_name
                    ? user.first_name + " " + user.last_name
                    : user.first_name
                    ? user.first_name
                    : user.username
                    ? user.username
                    : ""}
                </Text>
                <Text style={{fontSize: 12,marginTop:-5, color: "grey"}}>{user.email}</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView>
            <Button style={styles.button} onPress={this.navigateToScreen("HomeStack")}>
              <SvgHome style={styles.drawerItemIcon} width={20} height={20} />
              {/* <Image source={require("../../assets/imgs/home.png")} style={styles.img} /> */}
              <Text style={styles.text}>{t("HOME")}</Text>
            </Button>

            <Button style={styles.button} onPress={this.navigateToScreen("ProductScreen")}>
              <SvgShop style={styles.drawerItemIcon} width={20} height={20} />
              {/* <Image source={require("../../assets/imgs/shop.png")} style={styles.img} /> */}
              <Text style={styles.text}>{t("SHOP")}</Text>
            </Button>

            <Button style={styles.button} onPress={this.navigateToScreen("CategoryScreen")}>
              <SvgCategories style={styles.drawerItemIcon} width={20} height={20} />
              {/* <Image source={require("../../assets/imgs/category.png")} style={styles.img} /> */}
              <Text style={styles.text}>Shop by category</Text>
            </Button>
            <View style={styles.divider} />
            {!isEmpty(user) && (
              <>
                <Button style={styles.button} onPress={this.navigateToScreen("OrderStack")}>
                  <SvgOrder style={styles.drawerItemIcon} width={20} height={20} />
                  {/* <Image source={require("../../assets/imgs/order.png")} style={styles.img} /> */}
                  <Text style={styles.text}>{t("ORDERS")}</Text>
                </Button>
                <Button style={styles.button} onPress={this.navigateToScreen("CouponList")}>
                  <SvgCoupon style={styles.drawerItemIcon} width={20} height={20} />
                  {/* <Image source={require("../../assets/imgs/order.png")} style={styles.img} /> */}
                  <Text style={styles.text}>Coupons</Text>
                </Button>
                <Button style={styles.button} onPress={this.navigateToScreen("AccountSetting")}>
                  <SvgAccount style={styles.drawerItemIcon} width={20} height={20} />
                  {/* <Image source={require("../../assets/imgs/setting.png")} style={styles.img} /> */}
                  <Text style={styles.text}>{t("ACCOUNT")}</Text>
                </Button>
                <Button style={styles.button} onPress={this.navigateToScreen("ManageAddress")}>
                  <SvgManageAddress style={styles.drawerItemIcon} width={20} height={20} />
                  {/* <Image source={require("../../assets/imgs/address.png")} style={styles.img} /> */}
                  <Text style={styles.text}>{t("MANAGE_ADDRESS")}</Text>
                </Button>
                <Button style={styles.button} onPress={this.navigateToScreen("Notification")}>
                  <SvgNotification style={styles.drawerItemIcon} width={20} height={20} />
                  {/* <Image source={require("../../assets/imgs/bell.png")} style={styles.img} /> */}
                  <Text style={styles.text}>{t("NOTIFICATIONS")}</Text>
                </Button>
                <Button style={styles.button} onPress={this.navigateToScreen("WishlistScreen")}>
                  <SvgWishList style={styles.drawerItemIcon} width={20} height={20} />
                  {/* <Image source={require("../../assets/imgs/love.png")} style={styles.img} /> */}
                  <Text style={styles.text}>Wishlist</Text>
                </Button>
                <Button style={styles.button} onPress={this.navigateToScreen("Download")}>
                  <SvgDownload style={styles.drawerItemIcon} width={20} height={20} />
                  {/* <Image source={require("../../assets/imgs/download.png")} style={styles.img} /> */}
                  <Text style={styles.text}>{t("DOWNLOAD")}</Text>
                </Button>
                {wallet_active && (
                  <Button style={styles.button} onPress={this.navigateToScreen("WalletStack")}>
                  <SvgWallet style={styles.drawerItemIcon} width={20} height={20} />
                    {/* <Image source={require("../../assets/imgs/wallet.png")} style={styles.img} /> */}
                    <Text style={styles.text}>{t("WALLET")}</Text>
                  </Button>
                )}
                <View style={styles.divider} />
              </>
            )}

            {direct_tawk_id != "" && (
              <Button
                style={styles.button}
                onPress={this.navigateToScreen("TawkToChat", {uri: direct_tawk_id})}>
                 <SvgChat style={styles.drawerItemIcon} width={20} height={20} />
                {/* <Image source={require("../../assets/imgs/chat.png")} style={styles.img} /> */}
                <Text style={styles.text}>{t("CHAT_SUPPORT")}</Text>
              </Button>
            )}
            <Button style={styles.button} onPress={this.contactUs}>
            <SvgContactus style={styles.drawerItemIcon} width={20} height={20} />

              {/* <Image source={require("../../assets/imgs/telephone.png")} style={styles.img} /> */}
              <Text style={styles.text}>{t("CONTACT")}</Text>
            </Button>
            <Button style={styles.button} onPress={this.navigateToScreen("TermAndCondition")}>
            <SvgTOS style={styles.drawerItemIcon} width={20} height={20} />
              {/* <Image source={require("../../assets/imgs/term.png")} style={styles.img} /> */}
              <Text style={styles.text}>{t("TOS")}</Text>
            </Button>
            <Button style={styles.button} onPress={this.navigateToScreen("giveFeedback")}>
            <SvgFeedback style={styles.drawerItemIcon} width={20} height={20} />
              {/* <Image source={require("../../assets/imgs/review.png")} style={styles.img} /> */}
              <Text style={styles.text}>{t("GIVE_FEEDBACK")}</Text>
            </Button>
            {!isEmpty(user) && (
              <Button style={styles.button} onPress={this.navigateToScreen("Logout")}>
                 <SvgLogout style={styles.drawerItemIcon} width={20} height={20} />
                {/* <Image source={require("../../assets/imgs/logout.png")} style={styles.img} /> */}
                <Text style={styles.text}>{t("SIGN_OUT")}</Text>
              </Button>
            )}
          </ScrollView>
          <View style={styles.footer}>
            <Text style={{fontSize: 12, fontWeight: "500"}}>{"version : " + getVersion()}</Text>
          </View>
        </View>
        <Modal
          isVisible={isOpenModal}
          style={{margin: 0}}
          onBackButtonPress={this.closeModal}
          useNativeDriver
          hideModalContentWhileAnimating>
          <Login onClose={this.closeModal} navigation={this.props.navigation.state.params} />
        </Modal>

        <Modal
          isVisible={isContactModalOpen}
          style={{justifyContent: "flex-end", margin: 0, marginTop: "auto"}}
          onBackButtonPress={this.toggleContactModal}
          onBackdropPress={this.toggleContactModal}
          hasBackdrop
          useNativeDriver
          hideModalContentWhileAnimating>
          <View
            style={{
              backgroundColor: "#FFF",
              paddingVertical: 10,
              alignItems: "center",
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
            }}>
            <Text style={{fontSize: 20}}>Contact Us</Text>
            <View
              style={{
                height: 1.35,
                backgroundColor: "#d2d2d2",
                width: "100%",
                marginVertical: 10,
              }}
            />
            <View style={{}}>
              <Button
                style={[styles.contact_btn, {backgroundColor: accent_color}]}
                onPress={openEmail}>
                <Text style={{color: "#fff"}}>{t("EMAIL")}</Text>
              </Button>
              <Button
                style={[styles.contact_btn, {backgroundColor: accent_color, marginTop: 10}]}
                onPress={call}>
                <Text style={{color: "#fff"}}>Call</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const call = () => {
  let phoneNumber = 8077499184;
  if (Platform.OS === "ios") {
    phoneNumber = `telprompt:${phoneNumber}`;
  } else {
    phoneNumber = `tel:${phoneNumber}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then(supported => {
      if (!supported) {
        Alert.alert("Phone number is not available");
      } else {
        Linking.openURL(phoneNumber);
      }
    })
    .catch(err => console.log(err));
};

const openEmail = () => {
  let email = "mailto:support@schoolmegamart.com";
  Linking.canOpenURL(email)
    .then(supported => {
      if (!supported) {
        Alert.alert("Email is not available");
      } else {
        Linking.openURL(email);
      }
    })
    .catch(err => console.log(err));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // borderTopStartRadius: 20,
    //borderBottomStartRadius: 20,
  },
  divider: {
    backgroundColor: "#DBDBDB",
    height: 1,
    marginHorizontal: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
  },
  icon: {
    color: "#777777",
    marginEnd: 20,
    marginStart: 15,
    fontSize: 24,
  },
  text: {
    color: "#000000",
    fontWeight: "400",
    fontSize: 14,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingEnd: 16,
    paddingVertical: 4,
    marginBottom: 20,
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginHorizontal: 8,
    //justifyContent: "center",
    height: 110,
    flexDirection: "row",
    borderTopLeftRadius: 20,
  },
  contact_btn: {
    //  flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 4,
    height: 40,
    paddingHorizontal: 60,
  },
  img: {
    height: 22,
    width: 22,
    resizeMode: "contain",
    marginHorizontal: 16,
  },
  drawerItemIcon: {
    marginHorizontal: 20,
    color: "#F47C20",
    fontWeight: "900",
  },
});

const mapStateToProps = state => ({
  appSettings: state.appSettings,
  user: state.user,
});

const mapDispatchToProps = {
  logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Drawer));
