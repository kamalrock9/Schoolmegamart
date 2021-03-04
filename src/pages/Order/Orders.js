import React, {useEffect, useState} from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  unstable_batchedUpdates,
} from "react-native";
import {Text, Toolbar, EmptyList, HTMLRender} from "components";
import {WooCommerce, ApiClient} from "service";
import {useSelector} from "react-redux";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {isEmpty} from "lodash";
import analytics from "@react-native-firebase/analytics";
import Toast from "react-native-toast-message";

function Orders({navigation}) {
  const {t} = useTranslation();
  const user = useSelector(state => state.user);
  const {accent_color} = useSelector(state => state.appSettings);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setpage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  //const navigation = useNavigation();

  useEffect(() => {
    trackScreenView("Order Page");
    if (!isEmpty(user)) {
      const subscription = navigation.addListener("didFocus", () => {
        setpage(0);
      });
      return () => {
        subscription.remove();
      };
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, []);

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  useEffect(() => {
    if (!isEmpty(user)) {
      setLoading(true);
      loadOrder();
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, [page]);

  const onEndReached = () => {
    if (!hasMore) return;
    setpage(page + 1);
    setLoading(true);
    setHasMore(false);
  };

  const loadOrder = () => {
    console.log("order");
    let param = {
      offset: page * 10,
      limit: 10,
    };

    console.log(param);
    if (!isEmpty(user)) {
      console.log("check");
      setLoading(true);
      ApiClient.post("/" + user.id + "/order-list", param)
        .then(({data}) => {
          console.log(data.data);
          if (data.status) {
            unstable_batchedUpdates(() => {
              let array = page == 0 ? data.data : [...orders, ...data.data];
              setOrders(array);
              setHasMore(data.data.length == 10);
              setLoading(false);
            });
          } else {
            setLoading(false);
            setOrders([]);
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } else {
      setOrders([]);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2: "Please login first.",
      });
    }
  };

  const gotoOrderDetailsPage = item => () => {
    navigation.navigate("OrderDetails", {item: item});
  };

  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[styles.card, {marginTop: index == 0 ? 16 : 8}, {marginBottom: 8}]}
        onPress={gotoOrderDetailsPage(item)}>
        <View
          style={[
            styles.view,
            {borderBottomWidth: 1, paddingBottom: 12, paddingTop: 8, borderColor: "#d2d2d2"},
          ]}>
          <Text style={styles.font}>{t("ORDER_ID") + item.id}</Text>
          <Text
            style={{
              backgroundColor:
                item.status == "processing"
                  ? "#76A42E"
                  : item.status == "cancelled" ||
                    item.status == "cancel-request" ||
                    item.status == "failed"
                  ? "#ff0000"
                  : item.status == "completed"
                  ? "#39A3CA"
                  : item.status == "refunded"
                  ? "#76A42E"
                  : item.status == "on-hold"
                  ? "#D0C035"
                  : "#FDB82B",
              fontWeight: "600",
              fontSize: 12,
              color: "#fff",
              paddingHorizontal: 8,
              borderRadius: 3,
            }}>
            {item.status}
          </Text>
        </View>
        <View style={{marginTop: 5}}>
          <Text style={styles.smalltxt}>ITEMS</Text>
          <Text style={{fontWeight: "500"}}>{item.line_items.length}</Text>
        </View>
        <View style={{marginTop: 5}}>
          <Text style={styles.smalltxt}>TOTAL AMOUNT</Text>
          {/* <HTMLRender
            html={item.order_total.value ? item.order_total.value : <b />}
            baseFontStyle={{fontWeight: "600"}}
          /> */}
          <Text style={[styles.text, styles.font]}>{item.currency_symbol + "" + item.total}</Text>
        </View>
        <View style={{marginTop: 10}}>
          <Text style={styles.smalltxt}>ORDERED ON</Text>
          <Text style={[styles.text, styles.font]}>
            {moment(item.date_created).format("MMM DD,YYYY") +
              " " +
              moment(item.date_created).format("hh:mm A")}
          </Text>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderColor: "#d2d2d2",
            paddingTop: 12,
            marginTop: 8,
            paddingBottom: 4,
            flexDirection: "row",
            alignItems: "center",
          }}>
          <Text style={[styles.smalltxt, {flex: 0, fontSize: 12}]}>Buyer: </Text>
          <Text style={[styles.text, styles.font, {paddingTop: 2}]}>
            {item.billing.first_name + " " + item.billing.last_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const _keyExtractor = (item, index) => item + "Sap" + index;

  const _handleRefresh = () => {
    setpage(0);
    loadOrder();
  };

  return (
    <View style={{backgroundColor: "#F9F9F9", flex: 1}}>
      <Toolbar menuButton title={t("ORDERS")} />
      {loading && isEmpty(orders) ? (
        <ActivityIndicator
          color={accent_color}
          size="large"
          style={{alignItems: "center", flex: 1, justifyContent: "center"}}
        />
      ) : (
        <FlatList
          data={orders}
          contentContainerStyle={{backgroundColor: "#F9F9F9"}}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.33}
          refreshing={refreshing}
          onRefresh={_handleRefresh}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
          ListFooterComponent={
            orders.length > 0 && loading ? (
              <ActivityIndicator
                color={accent_color}
                size="large"
                style={{alignItems: "center", justifyContent: "center"}}
              />
            ) : null
          }
          ListEmptyComponent={
            <EmptyList
              loading={loading}
              label="No order has been placed yet"
              iconName="list-unordered"
              iconType="Octicons"
            />
          }
        />
      )}
    </View>
  );
}

Orders.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    //elevation: 2,
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    //backgroundColor: "#fff",
    borderColor: "#adadad",
    borderWidth: 1,
  },
  view: {flexDirection: "row", justifyContent: "space-between"},
  text: {
    flex: 1,
    lineHeight: 18,
  },
  font: {fontWeight: "600", fontSize: 13},
  smalltxt: {
    flex: 1,
    lineHeight: 18,
    fontSize: 10,
    color: "#adadad",
    fontWeight: "400",
  },
});

export default Orders;
