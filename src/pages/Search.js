import { View, StyleSheet, StatusBar, TextInput, FlatList, TouchableOpacity } from "react-native"
import { Text, Icon, Button, HTMLRender } from "components";
import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { ApiClient } from "service";
import { isEmpty } from "lodash"
import FitImage from "react-native-fit-image";

function Search({ navigation }) {

    const { primary_color, primary_color_dark, primary_color_text } = useSelector(state => state.appSettings)

    const [textinput, setTextInput] = useState('');
    const [results, setResults] = useState([]);
    const [cate, setCate] = useState([]);

    const goBack = () => {
        navigation.goBack(null);
    };

    const gotoPage = (route, params) => () => {
        navigation.navigate(route, { params: params });
    }

    const gotoProuctScreenpage = (route, params) => () => {
        navigation.navigate(route, params);
    }

    const onChangeText = useCallback(text => {
        setTextInput(text)
        let param = {
            search: text,
            per_page: 4
        }
        ApiClient.get("custom-search", param).then(({ data }) => {
            console.log(data);
            setCate(data.categories);
            setResults(data.products);
        })
    })

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={gotoPage("ProductScreen", item.id)}>
                <Text style={{ marginVertical: 16, fontWeight: "400", fontSize: 12 }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    const renderItemResult = ({ item }) => {
        return (
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }} onPress={gotoProuctScreenpage("ProductDetailScreen", item)}>
                <FitImage source={{ uri: item.images[0].src }} style={{ width: 60, height: 60 }} resizeMode="contain" />
                <View style={{ marginStart: 10 }}>
                    <Text style={{ fontWeight: "400", lineHeight: 16, fontSize: 12 }}>{item.name}</Text>
                    <HTMLRender html={item.price_html || "<b></b>"} baseFontStyle={{ fontSize: 10, lineHeight: 16 }} />
                </View>
            </TouchableOpacity>
        )
    }

    const itemSeparatorComponentCate = () => {
        return (
            <View style={{ backgroundColor: "#d2d2d2", height: 1.35, width: "100%" }}></View>
        )
    }

    const itemSeparatorComponent = () => {
        return (
            <View style={{ backgroundColor: "#d2d2d2", height: 1.35, width: "100%" }}></View>
        )
    }

    const keyExtractor = item => item.id;

    const keyExtractorResult = item => item.id;

    return (
        <View>
            <StatusBar backgroundColor={primary_color_dark} barStyle="light-content" />
            <View style={[styles.view, { backgroundColor: primary_color, }]}>
                <Button onPress={goBack} style={styles.menuButton}>
                    <Icon color={primary_color_text} name="md-arrow-back" size={24} />
                </Button>
                <View style={{ flexDirection: "row", backgroundColor: "#fff", alignItems: "center", flex: 1, paddingStart: 10, borderRadius: 2 }}>
                    <Icon color={"grey"} name="md-search" size={20} />
                    <TextInput style={styles.input} placeholder="search" onChangeText={onChangeText} />
                </View>
            </View>
            <View style={{ marginHorizontal: 16 }}>
                {!isEmpty(cate) && (<FlatList data={cate} renderItem={renderItem} keyExtractor={keyExtractor} ItemSeparatorComponent={itemSeparatorComponentCate} />
                )}
                {!isEmpty(results) && (
                    <FlatList data={results} renderItem={renderItemResult} keyExtractor={keyExtractorResult} ItemSeparatorComponent={itemSeparatorComponent} />
                )}
                {textinput != '' && <Text style={{ alignSelf: "center", fontWeight: "300" }}>{"Search Mode for " + textinput}</Text>}
            </View>
        </View>
    )
}

Search.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    menuButton: { paddingHorizontal: 16, paddingVertical: 5 },
    view: { backgroundColor: "#000", width: "100%", flexDirection: "row", paddingVertical: 10, paddingRight: 10 },
    input: {
        flex: 1,
        paddingTop: 5,
        paddingRight: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        borderRadius: 2,
        backgroundColor: '#fff',
        color: '#424242',
    },
})

export default Search;