import {View, StyleSheet, FlatList, ActivityIndicator, Dimensions} from "react-native";
import {Text, Toolbar, HTMLRender, Icon, Button, ProgressDialog} from "components";
import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {WooCommerce, ApiClient} from "../../service";
import ConstantsDemo from "../../service/Config";
import {isEmpty} from "lodash";
import StarRating from "react-native-star-rating";
import {useSelector} from "react-redux";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";

const {width, height} = Dimensions.get("screen");
function Reviews({navigation}) {
  console.log(navigation.state.params);

  const {t} = useTranslation();
  const {accent_color, primary_color} = useSelector(state => state.appSettings);
  const user = useSelector(state => state.user);
  const [product] = useState(navigation.state.params);
  const [reviews, setReviews] = useState([]);
  const [reviewSettings, setReviewSetting] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackScreenView("Review Screen");
    // let p = navigation.state.params.id ? "?product_id=" + navigation.state.params.id : "";
    let param = {
      product_id: navigation.state.params.id ? navigation.state.params.id : "",
    };
    // let s = "&status=" + "approved";
    setLoading(true);
    ApiClient.post("/get-reviews", param)
      .then(({data}) => {
        console.log(data);
        setLoading(false);
        if (data.code) {
          setReviews(data.data);
        }
      })
      .catch(error => {});

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

  const trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  const gotoAddReview = () => {
    navigation.navigate("AddReview", {...navigation.state.params});
  };

  const renderItem = ({item, index}) => {
    var now = new Date(); //todays date
    var end = moment(item.value_data.comment_date).format("YYYY-MM-DD"); // another date
    var duration = moment.duration(moment(now).diff(moment(end)));
    return (
      <View
        style={{
          padding: 10,
          marginHorizontal: 8,
          marginTop: 8,
          elevation: 2,
          marginBottom: reviews.length - 1 == index ? 8 : 0,
          backgroundColor: "#fff",
          borderRadius: 4,
        }}
        key={index + "Sap"}>
        <Text style={{fontWeight: "500"}}>
          {item.value_data.comment_author}
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
            starSize={12}
            halfStarEnabled
            emptyStarColor={accent_color}
            fullStarColor={accent_color}
            halfStarColor={accent_color}
          />
          <Text style={{fontSize: 12}}>
            {"(" + moment(item.value_data.comment_date).format("DD MMM YY") + ")"}
          </Text>
        </View>
        <HTMLRender
          html={item.value_data.comment_content || <b />}
          baseFontStyle={{fontSize: 12}}
        />
        {!isEmpty(item.replys) && (
          <View
            style={{
              fontSize: 12,
              marginStart: 12,
              backgroundColor: "#f8f8f8",
              padding: 8,
              borderRadius: 16,
            }}>
            <Text style={{marginEnd: 4, fontWeight: "600"}}>{item.replys[0].comment_author}</Text>
            <HTMLRender
              html={item.replys[0].comment_content || <b />}
              baseFontStyle={{fontSize: 12}}
            />
          </View>
        )}
      </View>
    );
  };

  const keyExtractor = (item, index) => item + index;

  const itemSep = () => {
    return <View style={{marginHorizontal: 10, backgroundColor: "#d2d2d2", height: 1.25}} />;
  };

  return (
    <View style={{flex: 1}}>
      <Toolbar title="Reviews" backButton />
      {loading ? (
        <ActivityIndicator color={accent_color} size="large" style={{padding: 16, flex: 1}} />
      ) : !isEmpty(reviews) ? (
        <FlatList
          data={reviews}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={itemSep}
        />
      ) : isEmpty(reviews) ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Text>Be the first to write a review.</Text>
        </View>
      ) : (
        <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
          {reviewSettings.enable_reviews &&
            (!reviewSettings.review_rating_verification_required ||
              (reviewSettings.review_rating_verification_required &&
                reviewSettings.user_bought_product)) && (
              <Text style={styles.txt}>Be the first to review "{product.name}".</Text>
            )}
        </View>
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
