import {View, StyleSheet, FlatList} from "react-native";
import {Text, Toolbar, HTMLRender, Icon, Button} from "components";
import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {WooCommerce, ApiClient} from "../../service";
import ConstantsDemo from "../../service/Config";
import {isEmpty} from "lodash";
import StarRating from "react-native-star-rating";
import {useSelector} from "react-redux";
import moment from "moment";

function Reviews({navigation}) {
  console.log(navigation.state.params);

  const {t} = useTranslation();
  const {accent_color, primary_color} = useSelector(state => state.appSettings);
  const user = useSelector(state => state.user);
  const [product] = useState(navigation.state.params);
  const [reviews, setReviews] = useState([]);
  const [reviewSettings, setReviewSetting] = useState({});

  useEffect(() => {
    let p = navigation.state.params.id ? "?product=" + navigation.state.params.id : "";
    let s = "&status=" + "approved";
    WooCommerce.get("products/reviews" + p + s).then(({data}) => {
      setReviews(data);
      console.log(data);
    });

    let p_id = navigation.state.params.id ? "?product_id=" + navigation.state.params.id : "?";
    let u_id = user.id ? "&user_id=" + user.id : "";

    let URL = ConstantsDemo.baseURL + ConstantsDemo.path + "/";
    console.log(URL);
    console.log(p_id);

    ApiClient.get(URL + "product/review-settings" + p_id + u_id).then(({data}) => {
      console.log(data);
      setReviewSetting(data);
    });
  }, []);

  const gotoAddReview = () => {
    navigation.navigate("AddReview", {...navigation.state.params});
  };

  const renderItem = ({item}) => {
    var now = new Date(); //todays date
    var end = moment(item.date_created).format("YYYY-MM-DD"); // another date
    var duration = moment.duration(moment(now).diff(moment(end)));
    if (item.status == "approved") {
      return (
        <View style={{padding: 10}}>
          <Text style={{fontWeight: "500"}}>
            {item.reviewer}
            {reviewSettings.review_rating_verification_label && item.verified
              ? " (verified owner)"
              : ""}
          </Text>
          <View style={{flexDirection: "row"}}>
            <StarRating
              disabled
              maxStars={5}
              rating={parseInt(item.rating)}
              containerStyle={{justifyContent: "flex-start", marginVertical: 2}}
              starStyle={{marginEnd: 5}}
              starSize={10}
              halfStarEnabled
              emptyStarColor={accent_color}
              fullStarColor={accent_color}
              halfStarColor={accent_color}
            />
            <Text style={{fontSize: 12}}>{moment(duration).format("hh:mm [hrs]")}</Text>
          </View>
          <HTMLRender html={item.review || <b />} baseFontStyle={{fontSize: 12}} />
        </View>
      );
    }
  };

  const keyExtractor = (item, index) => item + index;

  const itemSep = () => {
    return <View style={{marginHorizontal: 10, backgroundColor: "#d2d2d2", height: 1.25}} />;
  };

  return (
    <View style={{flex: 1}}>
      <Toolbar title="Reviews" backButton />
      {isEmpty(reviews) ? (
        <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
          <Text style={styles.txt}>There is no review yet.</Text>
          {reviewSettings.enable_reviews &&
            (!reviewSettings.review_rating_verification_required ||
              (reviewSettings.review_rating_verification_required &&
                reviewSettings.user_bought_product)) && (
              <Text style={styles.txt}>Be the first to review "{product.name}".</Text>
            )}
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={itemSep}
        />
      )}

      {reviewSettings.enable_reviews &&
        (!reviewSettings.review_rating_verification_required ||
          (reviewSettings.review_rating_verification_required &&
            reviewSettings.user_bought_product)) && (
          <Button
            style={[
              styles.fabIcon,
              {
                backgroundColor: accent_color,
              },
            ]}
            onPress={gotoAddReview}>
            <Text>
              <Icon name="pencil" type="Octicons" size={22} color={"white"} />
            </Text>
          </Button>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  txt: {
    fontSize: 16,
    marginHorizontal: 16,
  },
  fabIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    marginEnd: 20,
    marginBottom: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Reviews;
