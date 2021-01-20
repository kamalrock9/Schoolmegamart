import {View, FlatList} from "react-native";
import React, {useState, useEffect} from "react";
import {Text, Toolbar, ProgressDialog} from "components";
import {ApiClient} from "service";
import Toast from "react-native-simple-toast";
import {isEmpty} from "lodash";

function TrackYourOrder({navigation}) {
  const {data} = navigation.state.params;
  console.log(data);
  const [Data] = useState(data);
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let oid = Data.id ? "?order_id=" + Data.id : "?order_id=''";
    setLoading(true);
    ApiClient.get("/track/order/delhivery" + oid)
      .then(({data}) => {
        setLoading(false);
        if (data.status) {
          console.log(data);
          setTrackingData(data.tracking_data);
        } else {
          Toast.show(data.err_msg, Toast.SHORT);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: "f9f9f9"}}>
      <Toolbar backButton title={"Track Your Order"} />
      {!isEmpty(trackingData) &&
        trackingData.map((items, index) => {
          return (
            <View>
              {items.map((subItems, sIndex) => {
                return (
                  <View
                    style={{
                      elevation: 2,
                      backgroundColor: "#fff",
                      padding: 8,
                      marginTop: 16,
                      marginHorizontal: 16,
                      borderRadius: 4,
                    }}
                    key={subItems.title + "sap" + sIndex}>
                    <Text>
                      <Text style={{fontWeight: "600"}}>Title :- </Text>
                      {subItems.title}
                    </Text>
                    <Text>
                      <Text style={{fontWeight: "600"}}>Status :- </Text>
                      {subItems.status}
                    </Text>
                    <Text>
                      <Text style={{fontWeight: "600"}}>Location :- </Text>
                      {subItems.location}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      {<ProgressDialog loading={loading} />}
    </View>
  );
}

export default TrackYourOrder;
