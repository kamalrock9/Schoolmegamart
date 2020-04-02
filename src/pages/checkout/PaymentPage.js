import React from "react";
import {View, StyleSheet} from "react-native";
import {Text, Toolbar, Button} from "components";
import {useTranslation} from "react-i18next";
import moment from "moment";
import {useSelector} from "react-redux";

function PaymentPage({navigation}) {
  console.log(navigation.state.params);

  const {accent_color} = useSelector(state => state.appSettings);
  const {t} = useTranslation();

  const {data} = navigation.state.params;

  const gotoHome = () => {
    console.log("OrderPage");
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={{flex: 1}}>
      <Toolbar title={t("ORDER_RECEIVED")} paymentpage />
      {(data.status == "processing" || data.status == "on-hold") && (
        <View style={styles.card}>
          <Text>{t("ORDER_CREATED_THANKYOU_MESSAGE")}</Text>
        </View>
      )}
      {data.status == "failed" && (
        <View style={styles.card}>
          <Text>{t("ORDER_FAILED")}</Text>
        </View>
      )}
      <View style={[styles.card, {alignItems: "flex-start"}]}>
        <Text style={styles.heading}>{t("ORDER_DETAILS")}</Text>

        <View style={styles.view}>
          <Text>{t("ORDER_ID")}</Text>
          <Text>275</Text>
        </View>
        {data.line_items.map(item => {
          return (
            <View style={styles.view} key={item.id}>
              <Text>{item.name + " x" + item.quantity}</Text>
              <Text>{item.total}</Text>
            </View>
          );
        })}

        <View style={styles.view}>
          <Text>{t("DATE")}</Text>
          <Text>
            {moment(data.date_created).format("MMM DD,YYYY") +
              " " +
              moment(data.date_created).format("hh:mm A")}
          </Text>
        </View>
        <View style={styles.view}>
          <Text>{t("SHIPPING")}</Text>
          <Text>{data.shipping_lines[0].method_title}</Text>
        </View>
        <View style={styles.view}>
          <Text>{t("PAYMENT_METHODS")}</Text>
          <Text>{data.payment_method_title || datas.payment_method}</Text>
        </View>
        <View style={styles.view}>
          <Text>{t("STATUS")}</Text>
          <Text>{data.status}</Text>
        </View>
        <View style={styles.view}>
          <Text>{t("TOTAL_AMOUNT")}</Text>
          <Text>
            {data.prices_include_tax
              ? data.total + " (inc. taxes)"
              : (Number(data.total) + Number(data.total_tax)).toFixed(2) + " (inc. taxes)"}
          </Text>
        </View>
      </View>
      <View style={[styles.card, {alignItems: "flex-start"}]}>
        <Text style={styles.heading}>{t("CUSTOMER_DETAILS")}</Text>
        <View style={styles.view}>
          <Text>{t("NAME")}</Text>
          <Text>{data.billing.first_name + " " + data.billing.last_name}</Text>
        </View>
        <View style={styles.view}>
          <Text>{t("EMAIL")}</Text>
          <Text>{data.billing.email}</Text>
        </View>
        <View style={styles.view}>
          <Text>{t("PHONE_NUMBER")}</Text>
          <Text>{data.billing.phone}</Text>
        </View>
      </View>
      {(data.status == "processing" || data.status == "on-hold") && (
        <View style={styles.footer}>
          <View style={{flexDirection: "row", width: "100%"}}>
            <Button
              style={[styles.footerButton, {backgroundColor: accent_color}]}
              onPress={gotoHome}>
              <Text style={{color: "white", marginEnd: 5}}>{t("CONTINUE_SHOPPING")}</Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#fff",
    elevation: 2,
    padding: 10,
    borderRadius: 4,
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 13,
  },
  heading: {fontWeight: "500", fontSize: 16},
  footer: {
    width: "100%",
    borderTopColor: "#dedede",
    borderTopWidth: 1,
    //position: "relative",
    //bottom: 0,
  },
  footerButton: {
    flex: 1,
    height: 40,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PaymentPage;
