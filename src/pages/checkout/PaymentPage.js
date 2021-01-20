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
import InAppBrowser from "react-native-inappbrowser-reborn";
import Paytm from "react-native-paytm";
import {isEmpty} from "lodash";
import PayuMoney, {HashGenerator} from "react-native-payumoney";
import analytics from "@react-native-firebase/analytics";
function PaymentPage({navigation}) {
  console.log(navigation.state.params);

  const user = useSelector(state => state.user);
  const {accent_color, primary_color} = useSelector(state => state.appSettings);
  const {t} = useTranslation();

  const {Orderdata} = navigation.state.params;
  const [data, Setdata] = useState(Orderdata);
  const [id, Setid] = useState(data.id);

  useEffect(() => {
    trackScreenView("Payment Page");
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

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

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

      case "payumbolt":
        let hash = HashGenerator({
          key: "bwvmg5wR",
          amount: data.total,
          email: user.billing.email,
          txnId: data.id,
          productName: "product_info",
          firstName: user.billing.first_name,
          salt: "q7V4lJXKZr",
        });
        console.log(hash);

        const payData = {
          amount: data.total,
          txnId: data.id,
          productName: "product_info",
          firstName: user.billing.first_name,
          email: user.billing.email,
          phone: user.billing.phone,
          merchantId: "bwvmg5wR",
          key: "bwvmg5wR",
          successUrl: "https://www.payumoney.com/mobileapp/payumoney/success.php",
          failedUrl: "https://www.payumoney.com/mobileapp/payumoney/failure.php",
          isDebug: true,
          hash: hash,
        };

        PayuMoney(payData)
          .then(data => {
            // Payment Success
            console.log(data);
            if (data.success) {
              refreshPage(data.response.result.paymentId);
            }
          })
          .catch(e => {
            // Payment Failed
            console.log(e);
          });
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
        order_id: id,
        status: "processing",
        transaction_id: payment_id || "",
      };
      console.log(id, param);
      ApiClient.post("/checkout/update-order", param)
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            Setdata(res.data.data);
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
            <Text style={styles.fontweight}>{t("ORDER_CREATED_THANKYOU_MESSAGE")}</Text>
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
            <Text style={styles.fontweight}>{t("ORDER_ID")}</Text>
            <Text style={styles.fontweight}>{data.id}</Text>
          </View>
          {data.line_items.map(item => {
            return (
              <View style={styles.view} key={item.id}>
                <Text style={[styles.fontweight, {flex: 1}]}>
                  {item.name + " x" + item.quantity}
                </Text>
                <Text style={styles.fontweight}>{item.total}</Text>
              </View>
            );
          })}

          <View style={styles.view}>
            <Text style={styles.fontweight}>{t("DATE")}</Text>
            <Text style={styles.fontweight}>
              {moment(data.date_created).format("MMM DD,YYYY") +
                " " +
                moment(data.date_created).format("hh:mm A")}
            </Text>
          </View>
          {!isEmpty(data.shipping_lines) && (
            <View style={styles.view}>
              <Text style={styles.fontweight}>{t("SHIPPING")}</Text>
              <Text style={styles.fontweight}>{data.shipping_lines[0].method_title}</Text>
            </View>
          )}
          <View style={styles.view}>
            <Text style={styles.fontweight}>{t("PAYMENT_METHODS")}</Text>
            <Text style={styles.fontweight}>
              {data.payment_method_title || data.payment_method}
            </Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.fontweight}>{t("STATUS")}</Text>
            <Text style={styles.fontweight}>{data.status}</Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.fontweight}>{t("TOTAL_AMOUNT")}</Text>
            <Text style={styles.fontweight}>
              {data.prices_include_tax
                ? data.total + " (inc. taxes)"
                : (Number(data.total) + Number(data.total_tax)).toFixed(2) + " (inc. taxes)"}
            </Text>
          </View>
        </View>
        <View style={[styles.card, {alignItems: "flex-start", marginBottom: 50}]}>
          <Text style={styles.heading}>{t("CUSTOMER_DETAILS")}</Text>
          <View style={styles.view}>
            <Text style={styles.fontweight}>{t("NAME")}</Text>
            <Text style={styles.fontweight}>
              {data.billing.first_name + " " + data.billing.last_name}
            </Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.fontweight}>{t("EMAIL")}</Text>
            <Text style={styles.fontweight}>{data.billing.email}</Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.fontweight}>{t("PHONE_NUMBER")}</Text>
            <Text style={styles.fontweight}>{data.billing.phone}</Text>
          </View>
        </View>
      </ScrollView>
      {(data.status == "processing" || data.status == "on-hold") && (
        <View style={styles.footer}>
          <View style={{flexDirection: "row", width: "100%"}}>
            <Button
              style={[styles.footerButton, {backgroundColor: accent_color}]}
              onPress={gotoHome}>
              <Text style={{color: "white", marginEnd: 5, fontWeight: "500"}}>
                {t("CONTINUE_SHOPPING")}
              </Text>
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
    marginVertical: 12,
  },
  heading: {fontWeight: "500", fontSize: 16},
  footer: {
    width: "100%",
    //borderTopColor: "#dedede",
    //borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
  },
  footerButton: {
    flex: 1,
    height: 40,
    // margin: 5,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fontweight: {fontWeight: "500"},
});

export default PaymentPage;
