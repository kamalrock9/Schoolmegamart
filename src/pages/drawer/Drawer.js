import React from "react";
import {ScrollView, View, StyleSheet, Linking, Platform, Alert, Image} from "react-native";
import {Button, Text, Icon} from "components";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import Modal from "react-native-modal";
import Login from "../auth/Login";
import {getVersion} from "react-native-device-info";
import {isEmpty} from "lodash";
import {logout} from "store/actions";

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
          "Do You like using WooApp",
          null,
          [
            {text: "NOT REALLY", onPress: () => console.log("Cancel Pressed"), style: "cancel"},
            {
              text: "YES!",
              onPress: () => {
                if (Platform.OS != "ios") {
                  Linking.openURL(`market://details?id=${"com.phoeniixx.wooapp"}`).catch(err =>
                    alert("Please check for the Google Play Store"),
                  );
                } else {
                  Linking.openURL(
                    `itms://itunes.apple.com/in/app/apple-store/${APPLE_STORE_ID}`,
                  ).catch(err => alert("Please check for the App Store"));
                }
              },
            },
          ],
          {cancelable: false},
        );
        break;
      case "Logout":
        this.props.logout();
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
            <Icon
              name="account-circle"
              type="MaterialCommunityIcons"
              style={{fontSize: 54, marginEnd: 10}}
            />
            {isEmpty(user) ? (
              <Text style={{fontSize: 16}} onPress={this.openModal}>
                {t("LOGIN/REGISTER")}
              </Text>
            ) : (
              <View>
                <Text style={{fontSize: 16, fontWeight: "500"}}>
                  {user.first_name && user.last_name
                    ? user.first_name + " " + user.last_name
                    : user.first_name
                    ? user.first_name
                    : user.username
                    ? user.username
                    : ""}
                </Text>
                <Text style={{fontSize: 12, color: "grey"}}>{user.email}</Text>
              </View>
            )}
          </View>
          <ScrollView>
            <Button style={styles.button} onPress={this.navigateToScreen("HomeStack")}>
              <Image source={require("../../assets/imgs/home.png")} style={styles.img} />
              <Text style={styles.text}>{t("HOME")}</Text>
            </Button>

            <Button style={styles.button} onPress={this.navigateToScreen("ProductScreen")}>
              <Image source={require("../../assets/imgs/shop.png")} style={styles.img} />
              <Text style={styles.text}>{t("SHOP")}</Text>
            </Button>

            <Button style={styles.button} onPress={this.navigateToScreen("CategoryScreen")}>
              <Image source={require("../../assets/imgs/category.png")} style={styles.img} />
              <Text style={styles.text}>Shop by caregory</Text>
            </Button>
            <View style={styles.divider} />
            {!isEmpty(user) && (
              <>
                <Button style={styles.button} onPress={this.navigateToScreen("OrderStack")}>
                  <Image source={require("../../assets/imgs/order.png")} style={styles.img} />
                  <Text style={styles.text}>{t("ORDERS")}</Text>
                </Button>
                <Button style={styles.button} onPress={this.navigateToScreen("AccountSetting")}>
                  <Image source={require("../../assets/imgs/setting.png")} style={styles.img} />
                  <Text style={styles.text}>{t("ACCOUNT")}</Text>
                </Button>
                <Button style={styles.button} onPress={this.navigateToScreen("ManageAddress")}>
                  <Image source={require("../../assets/imgs/address.png")} style={styles.img} />
                  <Text style={styles.text}>{t("MANAGE_ADDRESS")}</Text>
                </Button>
                <Button style={styles.button} onPress={this.navigateToScreen("Notification")}>
                  <Image source={require("../../assets/imgs/bell.png")} style={styles.img} />
                  <Text style={styles.text}>{t("NOTIFICATIONS")}</Text>
                </Button>
                <Button style={styles.button} onPress={this.navigateToScreen("Download")}>
                  <Icon name="download" type="Entypo" style={styles.icon} />
                  <Text style={styles.text}>{t("DOWNLOAD")}</Text>
                </Button>
                {wallet_active && (
                  <Button style={styles.button} onPress={this.navigateToScreen("WalletStack")}>
                    <Icon name="wallet" type="Entypo" style={styles.icon} />
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
                <Icon name="chat" type="Entypo" style={styles.icon} />
                <Text style={styles.text}>{t("CHAT_SUPPORT")}</Text>
              </Button>
            )}
            <Button style={styles.button} onPress={this.contactUs}>
              <Image source={require("../../assets/imgs/telephone.png")} style={styles.img} />
              <Text style={styles.text}>{t("CONTACT")}</Text>
            </Button>
            <Button style={styles.button} onPress={this.navigateToScreen("TermAndCondition")}>
              <Image source={require("../../assets/imgs/term.png")} style={styles.img} />
              <Text style={styles.text}>{t("TOS")}</Text>
            </Button>
            <Button style={styles.button} onPress={this.navigateToScreen("giveFeedback")}>
              <Icon name="feedback" type="MaterialIcons" style={styles.icon} />
              <Text style={styles.text}>{t("GIVE_FEEDBACK")}</Text>
            </Button>
            {!isEmpty(user) && (
              <Button style={styles.button} onPress={this.navigateToScreen("Logout")}>
                <Image source={require("../../assets/imgs/logout.png")} style={styles.img} />
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
          <View style={{backgroundColor: "#FFF", padding: 10}}>
            <Text style={{fontSize: 20}}>Contact Us</Text>
            <View
              style={{
                height: 1.35,
                backgroundColor: "#d2d2d2",
                width: "100%",
                marginVertical: 10,
              }}
            />
            <View style={{flexDirection: "row"}}>
              <Button
                style={[styles.contact_btn, {backgroundColor: primary_color}]}
                onPress={openEmail}>
                <Text style={{color: "#fff"}}>{t("EMAIL").toUpperCase()}</Text>
              </Button>
              <Button style={[styles.contact_btn, {backgroundColor: accent_color}]} onPress={call}>
                <Text style={{color: "#fff"}}>{t("CALL")}</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const call = () => {
  let phoneNumber = 8860617526;
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
  let email = "mailto:www.phoeniixx.com";
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
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
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
    fontWeight: "500",
    fontSize: 12,
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 2,
  },
  img: {height: 22, width: 22, resizeMode: "contain", marginHorizontal: 16},
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
