import {View, StyleSheet} from "react-native";
import {Text, Toolbar, Icon, Button} from "components";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigation} from "react-navigation-hooks";
import analytics from "@react-native-firebase/analytics";

function ManageAddress() {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const user = useSelector(state => state.user);
  const appSettings = useSelector(state => state.appSettings);

  useEffect(() => {
    trackScreenView("Manage Address Page");
  }, []);

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  const _gotoBilling = route => () => {
    navigation.navigate(route);
  };

  return (
    <View>
      <Toolbar backButton title={"Manage Address"} />
      <View style={styles.view}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={[styles.heading, {color: appSettings.accent_color, marginBottom: 12}]}>
            {t("BILLING") + " " + t("ADDRESS")}
          </Text>
          <Button onPress={_gotoBilling("BillingAddress")}>
            <Icon
              name="pencil"
              type="MaterialCommunityIcons"
              size={22}
              color={appSettings.accent_color}
            />
          </Button>
        </View>
        {user.billing.first_name == "" ? (
          <Text style={{fontSize: 12}}>You have not saved any address yet.</Text>
        ) : (
          <>
            {user.billing.company != "" && (
              <Text style={styles.txt}>{user.billing.company ? user.billing.company : null}</Text>
            )}
            <Text style={styles.txt}>
              {user.billing.first_name && user.billing.last_name
                ? user.billing.first_name + " " + user.billing.last_name
                : user.billing.first_name
                ? user.billing.first_name
                : null}
            </Text>
            {user.billing.email != "" && (
              <Text style={styles.txt}>{user.billing.email ? user.billing.email : null}</Text>
            )}
            {user.billing.phone != "" && (
              <Text style={styles.txt}>{user.billing.phone ? user.billing.phone : null}</Text>
            )}
            {user.billing.address_1 != "" && (
              <Text style={styles.txt}>
                {user.billing.address_1 ? user.billing.address_1 : null}
              </Text>
            )}
            {user.billing.address_2 != "" && (
              <Text style={styles.txt}>
                {user.billing.address_2 ? user.billing.address_2 : null}
              </Text>
            )}
            <Text style={styles.txt}>
              {user.billing.city ? user.billing.city + " - " + user.billing.postcode : null}
            </Text>
            <Text style={styles.txt}>
              {user.billing.state ? user.billing.state + " \u2022 " + user.billing.country : null}
            </Text>
          </>
        )}
      </View>

      <View style={styles.line} />

      <View style={styles.view}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={[styles.heading, {color: appSettings.accent_color, marginBottom: 12}]}>
            {t("SHIPPING") + " " + t("ADDRESS")}
          </Text>
          <Button onPress={_gotoBilling("ShippingAddress")}>
            <Icon
              name="pencil"
              type="MaterialCommunityIcons"
              size={22}
              color={appSettings.accent_color}
            />
          </Button>
        </View>
        {user.shipping.first_name == "" ? (
          <Text style={{fontSize: 12}}>You have not saved any address yet.</Text>
        ) : (
          <>
            {user.shipping.company != "" && (
              <Text style={styles.txt}>{user.shipping.company ? user.shipping.company : null}</Text>
            )}
            <Text style={styles.txt}>
              {user.shipping.first_name && user.shipping.last_name
                ? user.shipping.first_name + " " + user.shipping.last_name
                : user.shipping.first_name
                ? user.shipping.first_name
                : null}
            </Text>
            {user.shipping.address_1 != "" && (
              <Text style={styles.txt}>
                {user.shipping.address_1 ? user.shipping.address_1 : null}
              </Text>
            )}
            {user.shipping.address_2 != "" && (
              <Text style={styles.txt}>
                {user.shipping.address_2 ? user.shipping.address_2 : null}
              </Text>
            )}
            {user.shipping.city != "" && (
              <Text style={styles.txt}>
                {user.shipping.city ? user.shipping.city + " - " + user.shipping.postcode : null}
              </Text>
            )}
            {user.shipping.state != "" && (
              <Text style={styles.txt}>
                {user.shipping.state
                  ? user.shipping.state + " \u2022 " + user.shipping.country
                  : null}
              </Text>
            )}
          </>
        )}
      </View>

      <View style={styles.line} />

      <Text style={{marginHorizontal: 16, marginTop: 16}}>{t("ADDRESS_USE")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {marginHorizontal: 16, marginTop: 16},
  heading: {fontWeight: "600", fontSize: 16},
  txt: {lineHeight: 18},
  line: {
    backgroundColor: "#d2d2d2",
    height: 1.35,
    marginHorizontal: 16,
    marginTop: 16,
  },
});
export default ManageAddress;
