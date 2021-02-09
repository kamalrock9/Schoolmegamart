import React, {useState, useEffect} from "react";
import {View, StyleSheet, FlatList} from "react-native";
import {Text, Toolbar, EmptyList} from "components";
import {ApiClient} from "service";
import analytics from "@react-native-firebase/analytics";
import moment from "moment";
import {useSelector} from "react-redux";

function CouponList({navigation}) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoding] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const appSettings = useSelector(state => state.appSettings);

  useEffect(() => {
    trackScreenView("Coupon List Page");
    ApiClient.get("/get-coupons")
      .then(({data}) => {
        setLoding(false);
        console.log(data);
        if (data.code) {
          setCoupons(data.data);
        }
      })
      .catch(error => {
        setLoding(false);
        console, log(error);
      });
  }, []);

  const _handleRefresh = () => {
    setLoding(true);
    ApiClient.get("/get-coupons")
      .then(({data}) => {
        setLoding(false);
        console.log(data);
        if (data.code) {
          setCoupons(data.data);
        }
      })
      .catch(error => {
        setLoding(false);
        console, log(error);
      });
  };

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  const _renderItem = ({item, index}) => {
    return (
      <View style={[styles.itemContainer, {marginTop: index > 0 ? 8 : 8, flex: 1}]}>
        <View style={{flex: 1}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", marginEnd: 8}}>
            <Text style={{fontWeight: "600", fontSize: 14}}> {item.coupon_code.toUpperCase()}</Text>
            <Text style={{fontSize: 12}}>Validity</Text>
          </View>
          <View style={{flexDirection: "row", justifyContent: "flex-end", marginEnd: 8}}>
            <Text style={{fontSize: 12, fontWeight: "600"}}>
              {item.expiry_date_time
                ? moment(item.expiry_date_time.date).format("MMMM")
                : "no limit"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingEnd: 8,
              alignItems: "flex-end",
            }}>
            <Text
              style={{
                backgroundColor: appSettings.primary_color,
                borderRadius: 12,
                paddingHorizontal: 8,
                color: "red",
                height: 20,
                fontSize: 10,
                paddingTop: 2,
              }}>
              {item.coupon_code.toUpperCase()}
            </Text>
            <View>
              <Text style={{fontSize: 12, fontWeight: "600"}}>
                {item.expiry_date
                  ? moment(item.expiry_date, "YYYY-MM-DD").format("DD,YYYY")
                  : "no limit"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const _keyExtractor = item => "Sap" + item.ID;

  return (
    <View style={{flex: 1}}>
      <Toolbar backButton title={"Coupons List"} />
      <View style={{flex: 1}}>
        <FlatList
          data={coupons}
          refreshing={refreshing}
          onRefresh={_handleRefresh}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
          contentContainerStyle={{padding: 4}}
          ListEmptyComponent={<EmptyList loading={loading} label={"No coupons are available"} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginVertical: 4,
    // elevation: 2,
    // backgroundColor: "#fff",
    borderColor: "#adadad",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});

export default CouponList;
