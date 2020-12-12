import React from "react";
import {StyleSheet, View, FlatList, ActivityIndicator} from "react-native";
import {Toolbar, Container, Text, Button, Icon, EmptyList} from "components";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

function SortOptions({sort, onBackButtonPress, sortData}) {
  const {accent_color} = useSelector(state => state.appSettings);
  const {t} = useTranslation();

  const sortByPopularity = () => {
    sortData && sortData("popularity");
  };
  const sortByDate = () => {
    sortData && sortData("date");
  };
  const sortByPriceASC = () => {
    sortData && sortData("price_asc");
  };
  const sortByPriceDesc = () => {
    sortData && sortData("price_desc");
  };
  const sortByRating = () => {
    sortData && sortData("rating");
  };
  const sortByFeatured = () => {
    sortData && sortData("featured");
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={{fontWeight: "600", fontSize: 16}}>{t("SORT")}</Text>
        <Button onPress={onBackButtonPress}>
          <Icon type="Entypo" name="cross" size={24} />
        </Button>
      </View>
      <Button style={styles.sortbtn} onPress={sortByPopularity}>
        <Text style={{color: sort == "popularity" ? accent_color : "#000", fontWeight: "500"}}>
          {t("POPULARITY")}
        </Text>
        {sort == "popularity" && (
          <Icon
            name="md-checkmark"
            size={24}
            color={sort == "popularity" ? accent_color : "#000"}
          />
        )}
      </Button>
      <Button style={styles.sortbtn} onPress={sortByRating}>
        <Text style={{color: sort == "rating" ? accent_color : "#000", fontWeight: "500"}}>
          {t("AVERAGE_RATING")}
        </Text>
        {sort == "rating" && (
          <Icon name="md-checkmark" size={24} color={sort == "rating" ? accent_color : "#000"} />
        )}
      </Button>
      <Button style={styles.sortbtn} onPress={sortByDate}>
        <Text style={{color: sort == "date" ? accent_color : "#000", fontWeight: "500"}}>
          {t("NEWNESS")}
        </Text>
        {sort == "date" && (
          <Icon name="md-checkmark" size={24} color={sort == "date" ? accent_color : "#000"} />
        )}
      </Button>
      <Button style={styles.sortbtn} onPress={sortByPriceASC}>
        <Text style={{color: sort == "price_asc" ? accent_color : "#000", fontWeight: "500"}}>
          {t("PRICE_ASC")}
        </Text>
        {sort == "price_asc" && (
          <Icon name="md-checkmark" size={24} color={sort == "price_asc" ? accent_color : "#000"} />
        )}
      </Button>
      <Button style={styles.sortbtn} onPress={sortByPriceDesc}>
        <Text style={{color: sort == "price_desc" ? accent_color : "#000", fontWeight: "500"}}>
          {t("PRICE_DESC")}
        </Text>
        {sort == "price_desc" && (
          <Icon
            name="md-checkmark"
            size={24}
            color={sort == "price_desc" ? accent_color : "#000"}
          />
        )}
      </Button>
      <Button style={styles.sortbtn} onPress={sortByFeatured}>
        <Text style={{color: sort == "featured" ? accent_color : "#000", fontWeight: "500"}}>
          Featured
        </Text>
        {sort == "featured" && (
          <Icon
            name="md-checkmark"
            size={24}
            color={sort == "popularity" ? accent_color : "#000"}
          />
        )}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
    borderBottomWidth: 2,
    paddingHorizontal: 16,
    borderColor: "#F0F0F0",
  },
  sortbtn: {
    paddingTop: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
});

export default SortOptions;
