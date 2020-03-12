import React from "react";
import {View, Image, FlatList, StyleSheet} from "react-native";
import {Text, Toolbar} from "components";
import {isEmpty} from "lodash";

function OrderDetails({navigation}) {
  const item = navigation.getParam("item");
  console.log(item);

  const _listHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 16,
          marginTop: 10,
          marginBottom: 25,
        }}>
        <Text style={{fontWeight: "600"}}>PRODUCTS</Text>
        <Text>{item.line_items.length + "Item(S)"}</Text>
      </View>
    );
  };

  const _renderItem = ({item, index}) => {
    return (
      <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: 16}}>
        <Image
          style={{height: 100, width: 100}}
          source={{uri: "https://www.bigstockphoto.com/images/homepage/module-6.jpg"}}
        />
        <View style={{marginStart: 10, flex: 1}}>
          <Text style={{fontWeight: "600", fontSize: 16}}>{item.name}</Text>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.txt}>{item.price}</Text>
            <Text style={styles.txt}>{"Qty:" + item.quantity}</Text>
            <Text style={styles.txt}>{item.subtotal}</Text>
          </View>
        </View>
      </View>
    );
  };

  const _listFooter = () => {
    return (
      <View>
        <View style={styles.line}></View>
        <Text style={styles.heading}>ORDER SUMMARY</Text>
        <View style={styles.footerSummaryView}>
          <Text style={styles.text}>Status</Text>
          <Text style={[styles.text, {color: "#000000"}]}>{item.status}</Text>
        </View>
        <View style={styles.footerSummaryView}>
          <Text style={styles.text}>Payment Method</Text>
          <Text style={[styles.text, {color: "#000000"}]}>{item.payment_method_title}</Text>
        </View>
        <View style={styles.footerSummaryView}>
          <Text style={styles.text}>
            {"Shipping (" + item.shipping_lines[0].method_title + ")"}
          </Text>
          <Text style={[styles.text, {color: "#000000"}]}>{item.shipping_lines[0].total}</Text>
        </View>
        <View style={styles.footerSummaryView}>
          <Text style={styles.text}>Tax</Text>
          <Text style={[styles.text, {color: "#000000"}]}>{item.total_tax}</Text>
        </View>
        {!isEmpty(item.coupon_lines) &&
          item.coupon_lines.map(item => {
            return (
              <View style={styles.footerSummaryView}>
                <Text style={styles.text}>{"Coupon (" + item.code + ")"}</Text>
                <Text style={[styles.text, {color: "#000000"}]}>{item.discount}</Text>
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
          }}></View>
        <View style={styles.footerSummaryView}>
          <Text style={[styles.text, {fontWeight: "600"}]}>Total Amount</Text>
          <Text style={[styles.text, {fontWeight: "600", color: "#000000"}]}>
            {item.prices_include_tax
              ? item.total + "(Inc. Taxes)"
              : (Number(item.total) + Number(item.total_tax)).toFixed(2) + "(Inc. Taxes)"}
          </Text>
        </View>
        <View style={styles.line}></View>
        <Text style={styles.heading}>ADDRESS INFORMATION</Text>
        <View style={styles.card}>
          <Text style={{fontSize: 18, fontWeight: "600", color: "#757575"}}>Billing Address</Text>
          <Text style={styles.billingtxt}>
            {item.billing.company ? item.billing.company : null}
          </Text>
          <Text style={styles.billingtxt}>
            {item.billing.first_name && item.billing.last_name
              ? item.billing.first_name + " " + item.billing.last_name
              : item.billing.first_name
              ? item.billing.first_name
              : null}
          </Text>
          <Text style={styles.billingtxt}>
            {item.billing.address_1 ? item.billing.address_1 : null}
          </Text>
          {!isEmpty(item.billing.address_2) && (
            <Text style={styles.billingtxt}>{item.billing.address_2}</Text>
          )}
          <Text style={styles.billingtxt}>
            {item.billing.city ? item.billing.city + " - " + item.billing.postcode : null}
          </Text>
          <Text style={styles.billingtxt}>
            {item.billing.state ? item.billing.state + " \u2022 " + item.billing.country : null}
          </Text>
        </View>
        <View style={[styles.card, {marginTop: 16, marginBottom: 30}]}>
          <Text style={{fontSize: 18, fontWeight: "600", color: "#757575"}}>Shipping Address</Text>
          <Text style={styles.billingtxt}>
            {item.shipping.company ? item.shipping.company : null}
          </Text>
          <Text style={styles.billingtxt}>
            {item.shipping.first_name && item.shipping.last_name
              ? item.shipping.first_name + " " + item.shipping.last_name
              : item.shipping.first_name
              ? item.shipping.first_name
              : null}
          </Text>
          <Text style={styles.billingtxt}>
            {item.shipping.address_1 ? item.shipping.address_1 : null}
          </Text>
          {!isEmpty(item.shipping.address_2) && (
            <Text style={styles.billingtxt}>{item.shipping.address_2}</Text>
          )}
          <Text style={styles.billingtxt}>
            {item.shipping.city ? item.shipping.city + " - " + item.shipping.postcode : null}
          </Text>
          <Text style={styles.billingtxt}>
            {item.shipping.state ? item.shipping.state + " \u2022 " + item.shipping.country : null}
          </Text>
        </View>
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
        }}></View>
    );
  };

  const _keyExtractor = item => item.id;

  return (
    <View style={{flex: 1}}>
      <Toolbar backButton title="Orders" />
      <FlatList
        data={item.line_items}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        ItemSeparatorComponent={_itemSeperator}
        ListHeaderComponent={_listHeader}
        ListFooterComponent={_listFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "400",
    color: "#757575",
  },
  footerSummaryView: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  line: {
    height: 8,
    backgroundColor: "#d2d2d2",
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
  },
  heading: {fontWeight: "600", marginBottom: 10, paddingHorizontal: 16},
  billingtxt: {
    color: "#757575",
  },
  card: {
    elevation: 3,
    shadowRadius: 2,
    padding: 10,
    marginHorizontal: 16,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    backgroundColor: "#fff",
  },
  txt: {
    fontSize: 16,
    color: "#757575",
  },
});

export default OrderDetails;
