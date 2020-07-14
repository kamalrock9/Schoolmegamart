import {View, StyleSheet, TouchableOpacity, FlatList} from "react-native";
import {Text, Icon, Toolbar} from "components";
import React, {useEffect, useState} from "react";
import {WooCommerce} from "service";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Toast from "react-native-simple-toast";
import moment from "moment";

function Download() {
  const {t} = useTranslation();
  const user = useSelector(state => state.user);

  const [download, setDwonload] = useState([]);

  useEffect(() => {
    WooCommerce.get("customers/" + user.id + "/downloads").then(res => {
      console.log(res);
      if (res.status == 200) {
        setDwonload(res.data);
      } else {
        Toast.show("data not found");
      }
    });
  }, []);

  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          elevation: 2,
          shadowRadius: 2,
          shadowOpacity: 0.5,
          shadowOffset: {width: 0, height: 2},
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginTop: 16,
          marginBottom: index == download.length - 1 ? 16 : 0,
          padding: 10,
          borderRadius: 4,
        }}>
        <Icon name="file-document-box-multiple-outline" type="MaterialCommunityIcons" size={60} />
        <View
          style={{
            flexDirection: "row",
            marginStart: 10,
            alignItems: "center",
            flex: 1,
            justifyContent: "space-between",
          }}>
          <View style={{}}>
            <Text style={[styles.text, {fontWeight: "600"}]}>{item.product_name}</Text>
            <Text style={styles.text}>File Name : {item.download_name}</Text>
            <Text style={styles.text}>
              Expires : {moment(item.access_expires_gmt).format("MMM DD, YYYY")}
            </Text>
          </View>
          <Icon name="download" type="Entypo" size={30} color="blue" />
        </View>
      </TouchableOpacity>
    );
  };

  const _keyExtractor = item => item.download_id;

  return (
    <View>
      <Toolbar backButton title={t("DOWNLOAD")} />
      {download.length > 0 && (
        <FlatList data={download} renderItem={_renderItem} keyExtractor={_keyExtractor} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {lineHeight: 16},
});

export default Download;
