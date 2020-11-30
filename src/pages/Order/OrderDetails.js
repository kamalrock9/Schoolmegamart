import React, {useState} from "react";
import {View, Image, FlatList, StyleSheet} from "react-native";
import {Text, Toolbar, Button, ProgressDialog} from "components";
import {isEmpty} from "lodash";
import {useTranslation} from "react-i18next";
import {ApiClient} from "service";

function OrderDetails({navigation}) {
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
          source={{uri: "https://www.bigstockphoto.com/images/homepage/module-6.jpg"}}
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
                : data.currency_symbol +
                  "" +
                  (Number(data.total) + Number(data.total_tax)).toFixed(2) +
                  "(Inc. Taxes)"}
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
          <Text style={styles.billingtxt}>
            {data.billing.first_name && data.billing.last_name
              ? data.billing.first_name + " " + data.billing.last_name
              : data.billing.first_name
              ? data.billing.first_name
              : null}
          </Text>
          <Text style={styles.billingtxt}>
            {data.billing.address_1 ? data.billing.address_1 : null}
          </Text>
          {!isEmpty(data.billing.address_2) && (
            <Text style={styles.billingtxt}>{data.billing.address_2}</Text>
          )}
          <Text style={styles.billingtxt}>
            {data.billing.city ? data.billing.city + " - " + data.billing.postcode : null}
          </Text>
          <Text style={styles.billingtxt}>
            {data.billing.state ? data.billing.state + " \u2022 " + data.billing.country : null}
          </Text>
        </View>
        <View style={[styles.card, {marginTop: 16}]}>
          <Text style={{fontSize: 14, fontWeight: "600"}}>
            {t("SHIPPING") + " " + t("ADDRESS")}
          </Text>
          {data.shipping.company != "" && (
            <Text style={styles.billingtxt}>{data.shipping.company}</Text>
          )}
          <Text style={styles.billingtxt}>
            {data.shipping.first_name && data.shipping.last_name
              ? data.shipping.first_name + " " + data.shipping.last_name
              : data.shipping.first_name
              ? data.shipping.first_name
              : null}
          </Text>
          <Text style={styles.billingtxt}>
            {data.shipping.address_1 ? data.shipping.address_1 : null}
          </Text>
          {!isEmpty(data.shipping.address_2) && (
            <Text style={styles.billingtxt}>{data.shipping.address_2}</Text>
          )}
          <Text style={styles.billingtxt}>
            {data.shipping.city ? data.shipping.city + " - " + data.shipping.postcode : null}
          </Text>
          <Text style={styles.billingtxt}>
            {data.shipping.state ? data.shipping.state + " \u2022 " + data.shipping.country : null}
          </Text>
        </View>
        {data.status != "cancelled" && (
          <Button
            style={[styles.card, {marginTop: 16, alignItems: "center", backgroundColor: "red"}]}
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

  const _keyExtractor = item => item.id;

  return (
    <View style={{flex: 1, backgroundColor: "f9f9f9"}}>
      <Toolbar backButton title={t("ORDER") + " #" + data.id} />
      <FlatList
        contentContainerStyle={{backgroundColor: "#f9f9f9", flex: 1}}
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
