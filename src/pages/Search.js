import {View, StyleSheet, StatusBar, TextInput, FlatList, TouchableOpacity} from "react-native";
import {Text, Icon, Button, HTMLRender, Toolbar} from "components";
import React, {useState, useCallback} from "react";
import {useSelector} from "react-redux";
import {ApiClient} from "service";
import {isEmpty} from "lodash";
import FitImage from "react-native-fit-image";
import {debounce} from "lodash";

function Search({navigation}) {
  const {primary_color, primary_color_dark, primary_color_text} = useSelector(
    state => state.appSettings,
  );

  const [textinput, setTextInput] = useState("");
  const [results, setResults] = useState([]);
  const [cate, setCate] = useState([]);

  const goBack = () => {
    navigation.goBack(null);
  };

  const goToPage = (route, params = {}) => () => {
    navigation.push(route, params);
  };

  const onChangeText = useCallback(
    debounce(text => {
      setTextInput(text);
      let param = {
        search: text,
        per_page: 4,
      };
      ApiClient.get("custom-search", param).then(({data}) => {
        console.log(data);
        setCate(data.categories);
        setResults(data.products);
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
          style={{width: 60, height: 50, borderRadius: 4}}
          resizeMode="contain"
        />
        <View style={{marginStart: 10}}>
          <Text style={{fontWeight: "600", lineHeight: 16, fontSize: 12}}>{item.name}</Text>
          <HTMLRender
            html={item.price_html || "<b></b>"}
            baseFontStyle={{fontSize: 10, lineHeight: 16, fontWeight: "700"}}
          />
        </View>
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
    <View>
      <StatusBar backgroundColor={primary_color_dark} barStyle="light-content" />
      <View style={[styles.view, {backgroundColor: primary_color}]}>
        {/* <Button onPress={goBack} style={styles.menuButton}>
          <Icon color={primary_color_text} name="md-arrow-back" size={24} />
        </Button> */}
        <Toolbar backButton title={"SEARCH"} />
        <View style={[styles.textinputview, {backgroundColor: primary_color, marginTop: 16}]}>
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
      <View style={{marginHorizontal: 16}}>
        {!isEmpty(cate) && (
          <FlatList
            data={cate}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={itemSeparatorComponentCate}
          />
        )}
        {!isEmpty(results) && (
          <FlatList
            data={results}
            renderItem={renderItemResult}
            keyExtractor={keyExtractorResult}
            ItemSeparatorComponent={itemSeparatorComponent}
          />
        )}
        {textinput != "" && (
          <Text style={{alignSelf: "center", fontWeight: "300", marginTop: 16}}>
            {"Search More for " + textinput}
          </Text>
        )}
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
    paddingVertical: 10,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    paddingTop: 5,
    paddingRight: 10,
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
    paddingStart: 10,
    borderRadius: 2,
  },
  seperator: {backgroundColor: "#d2d2d2", height: 1.35, width: "100%"},
});

export default Search;
