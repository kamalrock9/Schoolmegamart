import React, {useState} from "react";
import {View, Image, FlatList, StyleSheet, PermissionsAndroid, Alert} from "react-native";
import {Text, Toolbar, Button, ProgressDialog} from "components";
import {isEmpty} from "lodash";
import {useTranslation} from "react-i18next";
import {ApiClient} from "service";
import {useSelector} from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import Toast from "react-native-simple-toast";

function OrderDetails({navigation}) {
  const {accent_color} = useSelector(state => state.appSettings);
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const Data = navigation.getParam("item");
  console.log(Data);
  const [data, Setdata] = useState(Data);

  const _cancelOrder = () => {
    var param = {
      order_id: data.id,
      status: "cancel-request",
      transaction_id: data.payment_id != "" ? data.payment_id : "" || "",
    };
    console.log(param);
    setLoading(true);
    ApiClient.post("/checkout/update-order", param)
      .then(res => {
        setLoading(false);
        console.log(res);
        if (res.status == 200) {
          Setdata(res.data.data);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const _trackYourOrder = () => {
    navigation.navigate("TrackYourOrder", {data});
  };

  const actualDownload = () => {
    //console.log(data.invoice_action["wcfm-store-invoice-3"].url);
    const {dirs} = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: data.invoice_action["wcfm-store-invoice-3"].name,
        path: `${dirs.DownloadDir}` + "/" + data.invoice_action["wcfm-store-invoice-3"].name,
      },
    })
      .fetch("GET", data.invoice_action["wcfm-store-invoice-3"].url, {})
      .then(res => {
        Toast.show(res.path(), Toast.LONG);
        console.log("The file saved to ", res.path());
      })
      .catch(e => {
        console.log(e);
      });
  };

  const _downloadInvoice = () => {
    actualDownload();
    // try {
    //   const granted = PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //   );
    //   console.log(granted);
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     actualDownload();
    //   } else {
    //     Alert.alert(
    //       "Permission Denied!",
    //       "You need to give storage permission to download the file",
    //     );
    //   }
    // } catch (err) {
    //   console.warn(err);
    // }
  };

  // const _listHeader = () => {
  //   return (
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         marginHorizontal: 16,
  //         marginTop: 10,
  //         marginBottom: 25,
  //       }}>
  //       <Text style={{fontWeight: "600", fontSize: 12}}>{t("PRODUCTS").toUpperCase()}</Text>
  //       <Text style={{fontSize: 12}}>{item.line_items.length + " Item(S)"}</Text>
  //     </View>
  //   );
  // };

  const _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 16,
          borderTopStartRadius: 8,
          borderTopEndRadius: 8,
          elevation: 2,
          backgroundColor: "#fff",
          padding: 16,
          marginTop: index == 0 ? 8 : 0,
          borderBottomLeftRadius: data.line_items.length - 1 == index ? 8 : 0,
          borderBottomRightRadius: data.line_items.length - 1 == index ? 8 : 0,
        }}
        key={"Sap" + item.id}>
        <Image
          style={{height: 80, width: 80}}
          resizeMode="contain"
          source={{
            uri: item.img_src
              ? item.img_src
              : "https://www.bigstockphoto.com/images/homepage/module-6.jpg",
          }}
        />
        <View style={{marginStart: 10, flex: 1}}>
          <Text style={{fontWeight: "600", fontSize: 14}}>{item.name}</Text>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.txt}>{data.currency_symbol + "" + item.price}</Text>
            <Text style={styles.txt}>{"Qty:" + item.quantity}</Text>
            <Text style={styles.txt}>{data.currency_symbol + "" + item.subtotal}</Text>
          </View>
        </View>
      </View>
    );
  };

  const _listFooter = () => {
    return (
      <View>
        {/* <View style={styles.line} /> */}
        <View style={[styles.card, {marginTop: 16}]}>
          <Text style={styles.heading}>{t("ORDER_SUMMARY")}</Text>
          <View style={styles.footerSummaryView}>
            <Text style={styles.text}>Status</Text>
            <Text style={[styles.text, {color: "#000000"}]}>{data.status}</Text>
          </View>
          <View style={styles.footerSummaryView}>
            <Text style={styles.text}>{t("PAYMENT_METHODS")}</Text>
            <Text style={[styles.text, {color: "#000000"}]}>{data.payment_method_title}</Text>
          </View>
          {!isEmpty(data.shipping_lines) && (
            <View style={styles.footerSummaryView}>
              <Text style={styles.text}>
                {t("SHIPPING") + " (" + data.shipping_lines[0].method_title + ")"}
              </Text>
              <Text style={[styles.text, {color: "#000000"}]}>
                {data.currency_symbol + "" + data.shipping_lines[0].total}
              </Text>
            </View>
          )}
          <View style={styles.footerSummaryView}>
            <Text style={styles.text}>{t("TAX")}</Text>
            <Text style={[styles.text, {color: "#000000"}]}>
              {data.currency_symbol + "" + data.total_tax}
            </Text>
          </View>
          {!isEmpty(data.coupon_lines) &&
            data.coupon_lines.map(item => {
              return (
                <View style={styles.footerSummaryView}>
                  <Text style={styles.text}>{t("COUPON") + " (" + data.code + ")"}</Text>
                  <Text style={[styles.text, {color: "#000000"}]}>{data.discount}</Text>
                </View>
              );
            })}
          <View
            style={{
              height: 1.35,
              backgroundColor: "#d2d2d2",
              flex: 1,
              marginVertical: 5,
              paddingHorizontal: 16,
            }}
          />
          <View style={styles.footerSummaryView}>
            <Text style={[styles.text, {fontWeight: "600"}]}>{t("TOTAL") + " Amount"}</Text>
            <Text style={[styles.text, {fontWeight: "600", color: "#000000"}]}>
              {data.prices_include_tax
                ? data.currency_symbol + "" + data.total + "(Inc. Taxes)"
                : data.currency_symbol + "" + Number(data.total) + "(Inc. Taxes)"}
            </Text>
          </View>
        </View>
        {/* <View style={styles.line} /> */}
        {/* <Text style={styles.heading}>{t("ADDRESS_INFORMATION")}</Text> */}
        <View style={[styles.card, {marginTop: 16}]}>
          <Text style={{fontSize: 14, fontWeight: "600"}}>{t("BILLING") + " " + t("ADDRESS")}</Text>
          {data.billing.company != "" && (
            <Text style={styles.billingtxt}>{data.billing.company}</Text>
          )}
          {data.billing.first_name != "" && (
            <Text style={styles.billingtxt}>
              {data.billing.first_name && data.billing.last_name
                ? data.billing.first_name + " " + data.billing.last_name
                : data.billing.first_name
                ? data.billing.first_name
                : null}
            </Text>
          )}
          {data.billing.address_1 != "" && (
            <Text style={styles.billingtxt}>{data.billing.address_1}</Text>
          )}
          {!isEmpty(data.billing.address_2) && (
            <Text style={styles.billingtxt}>{data.billing.address_2}</Text>
          )}
          {data.billing.city != "" && (
            <Text style={styles.billingtxt}>
              {data.billing.city ? data.billing.city + " - " + data.billing.postcode : null}
            </Text>
          )}
          {data.billing.state != "" && (
            <Text style={styles.billingtxt}>
              {data.billing.state ? data.billing.state + " \u2022 " + data.billing.country : null}
            </Text>
          )}
        </View>
        <View style={[styles.card, {marginTop: 16}]}>
          <Text style={{fontSize: 14, fontWeight: "600"}}>
            {t("SHIPPING") + " " + t("ADDRESS")}
          </Text>
          {data.shipping.company != "" && (
            <Text style={styles.billingtxt}>{data.shipping.company}</Text>
          )}
          {data.shipping.first_name != "" && (
            <Text style={styles.billingtxt}>
              {data.shipping.first_name && data.shipping.last_name
                ? data.shipping.first_name + " " + data.shipping.last_name
                : data.shipping.first_name
                ? data.shipping.first_name
                : null}
            </Text>
          )}
          {!isEmpty(data.shipping.address_1) && (
            <Text style={styles.billingtxt}>{data.shipping.address_1}</Text>
          )}
          {!isEmpty(data.shipping.address_2) && (
            <Text style={styles.billingtxt}>{data.shipping.address_2}</Text>
          )}
          {data.shipping.city != "" && (
            <Text style={styles.billingtxt}>
              {data.shipping.city ? data.shipping.city + " - " + data.shipping.postcode : null}
            </Text>
          )}
          {data.shipping.state != "" && (
            <Text style={styles.billingtxt}>
              {data.shipping.state
                ? data.shipping.state + " \u2022 " + data.shipping.country
                : null}
            </Text>
          )}
        </View>
        <Button
          style={[
            styles.card,
            {marginTop: 16, alignItems: "center", backgroundColor: accent_color},
          ]}
          onPress={_trackYourOrder}>
          <Text style={{color: "#fff", fontWeight: "600"}}>Track Your Order</Text>
        </Button>
        <Button
          style={[
            styles.card,
            {marginTop: 16, alignItems: "center", backgroundColor: accent_color},
          ]}
          onPress={_downloadInvoice}>
          <Text style={{color: "#fff", fontWeight: "600"}}>Download Invoice</Text>
        </Button>
        {data.status != "cancelled" && (
          <Button
            style={[
              styles.card,
              {marginVertical: 16, alignItems: "center", backgroundColor: "red"},
            ]}
            onPress={_cancelOrder}>
            <Text style={{color: "#fff", fontWeight: "600"}}>Cancel Order</Text>
          </Button>
        )}
      </View>
    );
  };

  const _itemSeperator = () => {
    return (
      <View
        style={{
          height: 1.35,
          backgroundColor: "#d2d2d2",
          width: "100%",
          marginVertical: 10,
          marginHorizontal: 16,
        }}
      />
    );
  };

  const _keyExtractor = item => "Sap" + item.id;

  return (
    <View style={{flex: 1, backgroundColor: "f9f9f9"}}>
      <Toolbar backButton title={t("ORDER") + " #" + data.id} />
      <FlatList
        contentContainerStyle={{backgroundColor: "#f9f9f9"}}
        data={data.line_items}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        ItemSeparatorComponent={_itemSeperator}
        //    ListHeaderComponent={_listHeader}
        ListFooterComponent={_listFooter}
      />
      <ProgressDialog loading={loading} />
    </View>
  );
}

OrderDetails.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#757575",
  },
  footerSummaryView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  line: {
    height: 8,
    backgroundColor: "#d2d2d2",
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
  },
  heading: {fontWeight: "600", marginBottom: 10},
  billingtxt: {
    color: "#757575",
    fontWeight: "500",
  },
  card: {
    elevation: 3,
    shadowRadius: 2,
    padding: 10,
    marginHorizontal: 16,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  txt: {
    fontSize: 14,
    color: "#757575",
  },
});

export default OrderDetails;
