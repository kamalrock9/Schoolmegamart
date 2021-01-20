import React, {useState, useEffect} from "react";
import {View, StyleSheet, FlatList} from "react-native";
import {Text, Toolbar, EmptyList} from "components";
import {ApiClient} from "service";
import analytics from "@react-native-firebase/analytics";

function CouponList({navigation}) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoding] = useState(true);

  useEffect(() => {
    trackScreenView("Coupon List Page");
    ApiClient.post("/get-coupons")
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

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  const _renderItem = ({item, index}) => {
    return (
      <View style={[styles.itemContainer, {marginTop: index > 0 ? 8 : 0, flex: 1}]}>
        <View style={{flex: 1}}>
          <Text style={{fontWeight: "600", fontSize: 14}}> {item.coupon_code.toUpperCase()}</Text>
          {/* <Text style={{fontWeight: "700", fontSize: 18}}>{item.code.toUpperCase()}</Text> */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
              paddingEnd: 8,
              alignItems: "flex-end",
            }}>
            <Text
              style={{
                backgroundColor: "#FEB5B5",
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
              <Text style={{fontSize: 12, color: "grey"}}>Validity:</Text>
              <Text style={{fontSize: 12, color: "grey"}}>
                {item.expiry_date ? moment(item.expiry_date).format("MMMM DD,YYYY") : "no limit"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const _keyExtractor = item => "Sap" + item.ID;

  return (
    <View>
      <Toolbar backButton title={"Coupons List"} />
      <FlatList
        data={coupons}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        contentContainerStyle={{padding: 4, flexGrow: 1}}
        ListEmptyComponent={<EmptyList loading={loading} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginVertical: 4,
    elevation: 2,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});

export default CouponList;
