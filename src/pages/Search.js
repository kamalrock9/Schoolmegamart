import {
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {Text, Icon, Button, HTMLRender, EmptyList, Toolbar} from "components";
import React, {useState, useEffect, useCallback} from "react";
import {useSelector} from "react-redux";
import {ApiClient} from "service";
import {isEmpty} from "lodash";
import FitImage from "react-native-fit-image";
import {debounce} from "lodash";
import analytics from "@react-native-firebase/analytics";

function Search({navigation}) {
  const {primary_color, primary_color_dark, accent_color} = useSelector(state => state.appSettings);

  const [textinput, setTextInput] = useState("");
  const [results, setResults] = useState([]);
  const [cate, setCate] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackScreenView("Search Page");
  }, []);

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  const goBack = () => {
    navigation.goBack(null);
  };

  const goToPage = (route, params = {}) => () => {
    if (params.type === "bundle") {
      navigation.push(route, {itemByProduct: params});
    } else {
      navigation.push(route, params);
    }
  };

  const onChangeText = useCallback(
    debounce(text => {
      setTextInput(text);
      let param = {
        search: text,
        per_page: 200,
      };
      setLoading(true);
      ApiClient.get("custom-search", param)
        .then(({data}) => {
          console.log(data);
          setLoading(false);
          setCate(data.categories);
          setResults(data.products);
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    }, 1000),
    [],
  );

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={goToPage("ProductScreen", {category_id: item.id})}>
        <Text style={{marginVertical: 16, fontWeight: "400", fontSize: 12}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderItemResult = ({item}) => {
    return (
      <TouchableOpacity
        style={{flexDirection: "row", alignItems: "center", paddingVertical: 10}}
        onPress={goToPage("ProductDetailScreen", item)}>
        <FitImage
          source={{uri: item.images[0].src}}
          style={{width: 50, height: 50, borderRadius: 4}}
          resizeMode="contain"
        />
        {/* <View style={{marginStart: 10, flex: 1}}> */}
        <Text style={{fontWeight: "600", fontSize: 12, flex: 1, marginStart: 8}}>{item.name}</Text>
        {/* <HTMLRender
            html={item.price_html || "<b></b>"}
            baseFontStyle={{fontSize: 10, lineHeight: 16, fontWeight: "700"}}
          /> */}
        {/* </View> */}
      </TouchableOpacity>
    );
  };

  const itemSeparatorComponentCate = () => {
    return <View style={styles.seperator} />;
  };

  const itemSeparatorComponent = () => {
    return <View style={styles.seperator} />;
  };

  const keyExtractor = item => "category_" + item.id;

  const keyExtractorResult = item => "products_" + item.id;

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={primary_color_dark} barStyle="light-content" />

      {/* <Button onPress={goBack} style={styles.menuButton}>
          <Icon color={primary_color_text} name="md-arrow-back" size={24} />
        </Button> */}
      <Toolbar backButton title={"SEARCH"} />
      <View style={styles.viewMain}>
        <View style={[styles.textinputview, {backgroundColor: primary_color}]}>
          <View
            style={[
              styles.view,
              {
                alignItems: "center",
                backgroundColor: "#fff",
                //  paddingTop: 8,
                flexDirection: "row",
                borderRadius: 4,
                elevation: 4,
                height: 40,
              },
            ]}>
            <TextInput
              style={[styles.input, {height: 28}]}
              placeholder="search"
              onChangeText={onChangeText}
            />
            <Icon color={"grey"} name="md-search" size={20} />
          </View>
        </View>
      </View>
      <View style={{marginHorizontal: 16, flex: 1}}>
        {/* {loading && (
          <ActivityIndicator
            color={accent_color}
            size="large"
            style={{padding: 16, marginTop: 16, flex: 1}}
          />
        )} */}
        {!isEmpty(cate) && (
          <FlatList
            data={cate}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={itemSeparatorComponentCate}
          />
        )}
        {/* {!isEmpty(results) && ( */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={results}
          // contentContainerStyle={{flex: 1}}
          renderItem={renderItemResult}
          keyExtractor={keyExtractorResult}
          ItemSeparatorComponent={itemSeparatorComponent}
          ListEmptyComponent={<EmptyList loading={loading} label={"No products are available"} />}
        />
        {/* )} */}
        {/* {textinput != "" && (
          <Text style={{alignSelf: "center", fontWeight: "300", marginTop: 16}}>
            {"Search More for " + textinput}
          </Text>
        )} */}
      </View>
    </View>
  );
}

Search.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  menuButton: {paddingHorizontal: 16, paddingVertical: 5},
  view: {
    backgroundColor: "#000",
    width: "100%",
    //flexDirection: "row",
    // paddingVertical: 10,
    paddingRight: 10,
  },
  viewMain: {
    backgroundColor: "#000",
    //  width: "100%",
    //flexDirection: "row",
    // paddingVertical: 10,
    // paddingRight: 10,
  },
  input: {
    flex: 1,
    paddingTop: 5,
    marginEnd: 20,
    paddingBottom: 5,
    paddingLeft: 10,
    borderRadius: 2,
    backgroundColor: "#fff",
    color: "#424242",
  },
  textinputview: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 16,
    //  borderRadius: 2,
    marginTop: -10,
    paddingBottom: 16,
  },
  seperator: {backgroundColor: "#d2d2d2", height: 1.35, width: "100%"},
});

export default Search;
