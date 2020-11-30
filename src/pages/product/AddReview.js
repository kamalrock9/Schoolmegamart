import React, {useState} from "react";
import {View, TextInput} from "react-native";
import {Text, Toolbar, Button} from "components";
import StarRating from "react-native-star-rating";
import {useSelector} from "react-redux";
import Toast from "react-native-simple-toast";
import {WooCommerce} from "../../service";
import {isEmpty} from "lodash";

function AddReview({navigation}) {
  console.log(navigation.state.params);
  const user = useSelector(state => state.user);
  const {accent_color} = useSelector(state => state.appSettings);
  const [star, countStar] = useState(0);
  const [review, setReview] = useState("");

  const onStarRatingPress = rating => {
    countStar(rating);
  };

  const submitReview = () => {
    if (review == "") {
      Toast.show("Please fill required details");
      return;
    }
    if (star == 0) {
      Toast.show("Rating is a required field");
      return;
    }
    if (isEmpty(user)) {
      Toast.show("Please login/register first.");
      return;
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(user.email) === false) {
      Toast.show("Please enter the valid email");
      return;
    }
    let param = {
      rating: star,
      review: review,
      reviewer: user.first_name != "" ? user.first_name + " " + user.last_name : user.username,
      reviewer_email: user.email,
    };
    param.product_id = navigation.state.params.id;
    if (!user.id) {
      param.status = "hold";
    }

    console.log(param);
    WooCommerce.post("products/reviews", param)
      .then(res => {
        console.log(res);
        if (res.status == 201) {
          if (res.data.status && res.data.status !== "approved") {
            Toast.show("Reviews will be published after admin approval");
          } else {
            Toast.show("You have given review sunccessfully");
          }
        } else {
          Toast.show("Error Occured");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View>
      <Toolbar title="Add a Review" backButton />
      <View
        style={{elevation: 2, backgroundColor: "#fff", margin: 10, padding: 10, borderRadius: 4}}>
        <Text style={{fontSize: 12}}>
          Your email address will not be published. Required fields are marked *
        </Text>
        <Text style={{marginTop: 20, fontSize: 10}}>Your Rating*</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={star}
          starStyle={{marginEnd: 5}}
          emptyStarColor={accent_color}
          fullStarColor={accent_color}
          halfStarColor={accent_color}
          starSize={12}
          containerStyle={{justifyContent: "flex-start", marginVertical: 10}}
          selectedStar={rating => onStarRatingPress(rating)}
        />
        <Text style={{marginTop: 10, fontSize: 10}}>Your Review*</Text>
        <TextInput onChangeText={text => setReview(text)} />
      </View>
      <Button
        style={{
          backgroundColor: accent_color,
          marginHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          paddingVertical: 5,
        }}
        onPress={submitReview}>
        <Text style={{color: "#fff"}}>Submit</Text>
      </Button>
    </View>
  );
}

export default AddReview;
