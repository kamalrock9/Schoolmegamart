import {View, StyleSheet, TouchableOpacity, FlatList,PermissionsAndroid,ActivityIndicator, Dimensions} from "react-native";
import {Text, Icon, Toolbar,Button} from "components";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Toast from "react-native-simple-toast";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";
import Constants from '../service/Config';
import axios from "axios";
import {isArray} from "lodash";
import RNFetchBlob from "rn-fetch-blob";
import base64 from "base-64";

const {width,height} = Dimensions.get("screen");
function Download({navigation}) {
  const {t} = useTranslation();
  const user = useSelector(state => state.user);
  const {accent_color} = useSelector(state => state.appSettings);

  const [download, setDwonload] = useState([]);
  const [loading,setLoading] = useState(false);
  const [refreshing,setRefreshing] = useState(false);

  useEffect(() => {
    trackScreenView("Download Page");
    const subscription = navigation.addListener("willFocus", () => {
     loadDownload();
    });
    return () => {
      subscription.remove();
    };
    
  }, []);

  const loadDownload = ()=>{
    setLoading(true);
    axios.get("https://schoolmegamart.com/wp-json/wc/v2/customers/" + user.id + "/downloads" ,{ headers: {
      'Authorization': "Basic "+  base64.encode(Constants.keys.consumerKey + ":" +  Constants.keys.consumerSecret)
    },
  }).then(res => {
    setLoading(false);
    setRefreshing(false);
    console.log(res);
    if (res.status == 200) {
      setDwonload(res.data);
    } else {
      Toast.show("data not found");
    }
  }).catch(error=>{
    setLoading(false)
    console.log(error);
  })
  }

  const _handleRefresh = () => {
    setRefreshing(true);
    loadDownload();
  };

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  const _download = item => () => {
    try {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(
        res => {
          console.log(res);
          if (res == "granted") {
            actualDownload(item);
          } else {
            Alert.alert(
              "Permission Denied!",
              "You need to give storage permission to download the file",
            );
          }
        },
      );
    } catch (err) {
      console.log(err);
    }
  };
  const actualDownload = item => {
    console.log(item.product_name);
    const {dirs} = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: item.name,
        path: `${dirs.DownloadDir}` + "/" + item.download_name,
      },
    })
      .fetch("GET", item.download_url, {})
      .then(res => {
        Toast.show(res.path(), Toast.LONG);
        console.log("The file saved to ", res.path());
      })
      .catch(e => {
        console.log(e);
      });
  };



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
            justifyContent: "space-between",
            flex:1
          }}>
          <View style={{flex:1}}>
            <Text style={[styles.text, {fontWeight: "600"}]}>{item.product_name}</Text>
            <Text style={styles.text}>File Name : {item.download_name}</Text>
            <Text style={styles.text}>
              Expires : {item.access_expires_gmt != "never" ? moment(item.access_expires_gmt).format("MMM DD, YYYY") : item.access_expires_gmt}
            </Text>
          </View>
          <Button onPress={_download(item)}>
          <Icon name="download" type="Entypo" size={30} color="blue" />
          </Button>
        </View>
      </TouchableOpacity>
    );
  };

  const _keyExtractor = item => item.download_id;

  return (
    <View>
      <Toolbar backButton title={t("DOWNLOAD")} />
      <View style={{flex:1}}>
      {loading ? (
        <ActivityIndicator color={accent_color} size="large" style={{padding: 16, width,height:height-56}} />
      ): download.length > 0 ? (
        <FlatList data={download} renderItem={_renderItem} keyExtractor={_keyExtractor}  onRefresh={_handleRefresh} refreshing={refreshing} />
      ) :  <View
      style={{
        height:height-56,
        width,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Text>No Books are available for downloads.</Text>
    </View>}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {lineHeight: 16},
});

export default Download;
