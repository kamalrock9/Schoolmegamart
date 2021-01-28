import React, {useState} from "react";
import {View, TextInput} from "react-native";
import {Text, Toolbar, Button, ProgressDialog} from "components";
import StarRating from "react-native-star-rating";
import {useSelector} from "react-redux";
import Toast from "react-native-simple-toast";
import {WooCommerce, ApiClient} from "../../service";
import {isEmpty} from "lodash";

function AddReview({navigation}) {
  console.log(navigation.state.params);
  const user = useSelector(state => state.user);
  const {accent_color} = useSelector(state => state.appSettings);
  const [star, countStar] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

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
      user_id: user.id,
      username: user.first_name != "" ? user.first_name + " " + user.last_name : user.username,
      user_email: user.email,
      comment: review,
      rating: star,
    };
    param.product_id = navigation.state.params.id;
    // if (!user.id) {
    //   param.status = "hold";
    // }

    console.log(param);
    setLoading(true);
    ApiClient.post("/add-review", param)
      .then(({data}) => {
        setLoading(false);
        console.log(data);
        if (data.code) {
          Toast.show("Your review has been sent successfully.", Toast.LONG);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <View>
      <Toolbar title="Add a Review" backButton />
      <View
        style={{ marginHorizontal:16}}>
        <Text style={{fontWeight:"500"}}>
  Your email address will not be published.
        </Text>
        <Text style={{fontWeight:"500"}}>Required fields are marked*</Text>
        <Text style={{marginTop: 20,fontSize:12,fontWeight:"600"}}>Your Rating*</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={star}
          starStyle={{marginEnd: 5}}
          emptyStarColor={accent_color}
          fullStarColor={accent_color}
          halfStarColor={accent_color}
          starSize={16}
          containerStyle={{justifyContent: "flex-start", marginVertical: 10}}
          selectedStar={rating => onStarRatingPress(rating)}
        />
        <Text style={{marginTop: 20,fontSize:12,fontWeight:"600"}}>Your Review*</Text>
        <TextInput 
        multiline={true}
        style={{textAlignVertical: 'top',backgroundColor:"#F8F8F8",height:100,borderRadius:4,borderWidth:1,borderColor:"grey",marginVertical:16,padding:10}}
        placeholder={"Would you like to write anything about product?"}
        onChangeText={text => setReview(text)} />
      </View>
      <Button
        style={{
          backgroundColor: accent_color,
          marginHorizontal: 16,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          paddingVertical: 5,
        }}
        onPress={submitReview}>
        <Text style={{color: "#fff"}}>Submit</Text>
      </Button>
      <ProgressDialog loading={loading} />
    </View>
  );
}

export default AddReview;
