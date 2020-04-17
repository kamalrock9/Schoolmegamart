import React, {useEffect, useState} from "react";
import {View, StyleSheet, ScrollView, Linking} from "react-native";
import {Text, Toolbar, Button} from "components";
import {useTranslation} from "react-i18next";
import moment from "moment";
import {useSelector} from "react-redux";
import Constants from "../../service/Config";
import {WooCommerce} from "../../service";
import RazorpayCheckout from "react-native-razorpay";
import {ApiClient} from "service";
import axios from "axios";
import InAppBrowser from "react-native-inappbrowser-reborn";
import Paytm from "react-native-paytm";
import {isEmpty} from "lodash";

function PaymentPage({navigation}) {
  console.log(navigation.state.params);

  const user = useSelector(state => state.user);
  const {accent_color, primary_color} = useSelector(state => state.appSettings);
  const {t} = useTranslation();

  const {Orderdata} = navigation.state.params;
  const [data, Setdata] = useState(Orderdata);
  const [id, Setid] = useState(data.id);
  const [status, Setstatus] = useState(data.status);

  useEffect(() => {
    if (
      data.payment_method == "cod" ||
      data.payment_method == "bacs" ||
      data.payment_method == "cheque"
    ) {
      // this.isShoppingComplete = true;
    } else {
      payment();
    }
  }, []);

  const payment = () => {
    console.log("payment");
    if (data.status && data.status === "failed") {
      return;
    }

    let payment_method = "?payment_method=" + data.payment_method;
    let order_id = "&ORDER_ID=" + data.id;
    let cus_id = "&CUST_ID=" + data.customer_id;
    if (data.payment_method == "razorpay") {
      razorpayCheckout();
      return;
    } else if (data.payment_method == "paytm") {
      paytmCheckout();
      return;
    } else if (data.payment_method == "paypal") {
      var url = Constants.baseURL + "/wp-json/wc/v2/payment" + payment_method + order_id + cus_id;
    }
    switch (data.payment_method) {
      case "paypal":
        try {
          const isAvailable = InAppBrowser.isAvailable();
          if (isAvailable) {
            InAppBrowser.open(url, {
              // iOS Properties
              dismissButtonStyle: "cancel",
              preferredBarTintColor: "gray",
              preferredControlTintColor: "white",
              // Android Properties
              showTitle: true,
              toolbarColor: "#6200EE",
              secondaryToolbarColor: "black",
              enableUrlBarHiding: true,
              enableDefaultShare: true,
              forceCloseOnRedirection: true,
            }).then(result => {
              Alert.alert(JSON.stringify(result));
            });
          } else {
            Linking.openURL(url);
          }
        } catch (error) {
          Alert.alert(error.message);
        }
    }
  };

  const paytmCheckout = () => {
    let txnRequest = {
      mode: "Staging",
      EMAIL: user.billing.email, // String
      MOBILE_NO: user.billing.phone, //Mobile
      MID: "Phoeni74329133703044", // PayTM Credentials
      ORDER_ID: data.id.toString(), //Should be unique for every order.
      CUST_ID: data.customer_id.toString(),
      INDUSTRY_TYPE_ID: "Retail", // PayTM Credentials
      CHANNEL_ID: "WEB", // PayTM Credentials
      TXN_AMOUNT: data.total.toString(), // Transaction Amount should be a String
      WEBSITE: "WEBSTAGING", // PayTM Credentials
      CALLBACK_URL: "https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=" + data.id,
      CHECKSUMHASH: "",
      ENVIRONMENT: "",
    };

    let formData = new FormData();
    Object.keys(txnRequest).forEach(k => {
      formData.append(k, txnRequest[k]);
    });

    ApiClient.post("checkout/paytm-checksum", formData)
      .then(res => {
        console.log(res);
        txnRequest.CHECKSUMHASH = res.data.CHECKSUMHASH;
        txnRequest.ENVIRONMENT = "staging";
        console.log(txnRequest);
        Paytm.startPayment(
          txnRequest,
          // response => {
          //   console.log(response);
          //   // if (response.STATUS == "TXN_SUCCESS") {
          //   //   refreshPage(response.TXNID);
          //   // } else {
          //   //   alert(
          //   //     "Transaction Failed for reason: - " +
          //   //       response.RESPMSG +
          //   //       " (" +
          //   //       response.RESPCODE +
          //   //       ")",
          //   //   );
          //   // }
          // },
          // error => {
          //   alert(
          //     "Transaction Failed for reason: - " + error.RESPMSG + " (" + error.RESPCODE + ")",
          //   );
          //   console.log(error);
          // },
        );
      })
      .catch(error => {
        console.log(error);
      });
  };

  const razorpayCheckout = () => {
    let options = {
      description: "Order  " + data.id,
      image: "",
      currency: data.currency,
      //key: "rzp_live_Mw6y1rFt9AqPGr",
      key: "rzp_test_AZkb1ZLjZv6vRh",
      amount: parseFloat(data.total) * 100,
      name: Constants.storeName,
      prefill: {
        email: data.billing.email || "",
        contact: data.billing.phone || "",
        name: data.billing.first_name + " " + data.billing.last_name,
      },
      theme: {
        color: primary_color,
      },
    };

    //Working ported typescript
    RazorpayCheckout.open(
      options,
      payment_id => {
        //alert('payment_id: ' + payment_id);
        refreshPage(payment_id.razorpay_payment_id);
      },
      error => {
        //alert(error.description + ' (Error ' + error.code + ')');
        refreshPage();
      },
    );
  };

  const refreshPage = payment_id => {
    //this.loader.show();
    if (payment_id) {
      var param = {
        status: "processing",
        transaction_id: payment_id || "",
      };
      console.log(id, param);
      WooCommerce.put("orders/" + id, param)
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            Setdata(res.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log(id);
      ApiClient.get("orders/" + id).then(
        res => {
          console.log(res);
          // this.orderDetails = res;
          // this.loader.dismiss();
        },
        err => {
          console.log(err);
        },
      );
    }
  };

  const gotoHome = () => {
    console.log("OrderPage");
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={{flex: 1}}>
      <Toolbar title={t("ORDER_RECEIVED")} paymentpage />
      <ScrollView>
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
          {!isEmpty(data.shipping_lines) && (
            <View style={styles.view}>
              <Text>{t("SHIPPING")}</Text>
              <Text>{data.shipping_lines[0].method_title}</Text>
            </View>
          )}
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
        <View style={[styles.card, {alignItems: "flex-start", marginBottom: 20}]}>
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
      </ScrollView>
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
