import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text, Toolbar } from "components";
import { WooCommerce } from "service";
import { useSelector } from "react-redux";
import moment from "moment";
import { useTranslation } from "react-i18next";

function Orders({ navigation }) {
  const { t } = useTranslation();
  const user = useSelector(state => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let params = {
      page: 1,
      per_page: 10,
    };

    setLoading(true);
    WooCommerce.get("orders?customer=" + user.id, params)
      .then(res => {
        console.log(res);
        setLoading(false);
        if (res.status == 200) {
          setOrders(res.data);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const gotoOrderDetailsPage = item => () => {
    navigation.navigate("OrderDetails", { item: item });
  };

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.card, { marginTop: index == 0 ? 8 : 4 }, { marginBottom: 4 }]}
        onPress={gotoOrderDetailsPage(item)}>
        <View style={styles.view}>
          <Text style={styles.font}>{t("ORDER_ID") + item.id}</Text>
          <Text style={{ color: "green", fontWeight: "500", fontSize: 18 }}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.view, { marginTop: 5 }]}>
          <Text style={styles.smalltxt}>{t("NO_OF_ITEMS")}</Text>
          <Text style={styles.smalltxt}>{t("TOTAL")}</Text>
        </View>
        <View style={styles.view}>
          <Text style={[styles.text, styles.font, { color: "#757575" }]}>
            {item.line_items.length} items(s)
          </Text>
          <Text style={[styles.text, styles.font, { color: "#757575" }]}>{item.total}</Text>
        </View>
        <View style={[styles.view, { marginTop: 10 }]}>
          <Text style={styles.smalltxt}>{t("ORDER_DATE")}</Text>
          <Text style={styles.smalltxt}>{t("BUYER")}</Text>
        </View>
        <View style={styles.view}>
          <Text style={[styles.text, styles.font, { color: "#757575" }]}>
            {moment(item.date_created).format("MMM DD,YYYY") +
              " " +
              moment(item.date_created).format("hh:mm A")}
          </Text>
          <Text style={[styles.text, styles.font, { color: "#757575" }]}>
            {item.billing.first_name + "" + item.billing.last_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const _keyExtractor = item => item.id;

  return (
    <View>
      <Toolbar backButton title={t("ORDERS")} />
      <FlatList data={orders} renderItem={_renderItem} keyExtractor={_keyExtractor} />
      {loading && <ActivityIndicator style={{ alignItems: "center", justifyContent: "center" }} />}
    </View>
  );
}

Orders.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    elevation: 2,
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: "#fff",
  },
  view: { flexDirection: "row", justifyContent: "space-between" },
  text: {
    flex: 1,
    lineHeight: 18,
  },
  font: { fontWeight: "600", fontSize: 16 },
  smalltxt: {
    flex: 1,
    lineHeight: 18,
    fontSize: 16,
    color: "#adadad",
    fontWeight: "400",
  },
});

export default Orders;
