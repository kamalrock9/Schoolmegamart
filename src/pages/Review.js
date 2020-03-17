import React, {useState} from "react";
import {View, StyleSheet, FlatList} from "react-native";
import {Text, Toolbar, Button, Icon, HTMLRender} from "components";
import {isEmpty} from "lodash";

function Review({navigation}) {
  const billing = navigation.getParam("billing");
  console.log(billing);
  const shipping = navigation.getParam("shipping");
  console.log(shipping);
  const cartData = navigation.getParam("cartData");

  const cartdata = Object.assign({}, cartData);
  const [data, setCart] = useState(cartdata);
  const [isSelectShipping, setShippingMethod] = useState(data.chosen_shipping_method);

  const selectShippingMethod = item => () => {
    console.log(item);
    setShippingMethod(item.id);
    setCart({...data, chosen_shipping_method: item.id});
    console.log(data);
  };

  const _renderItem = ({item}) => {
    return (
      <View style={styles.flexdirection}>
        <Text>{item.name + " x" + item.quantity}</Text>
        <HTMLRender html={item.subtotal || "<b></b>"} />
      </View>
    );
  };

  const _keyExtractor = item => item.cart_item_key;

  return (
    <View style={{marginHorizontal: 16}}>
      <View style={styles.card}>
        <Text style={styles.heading}>Shipping Method(S)</Text>
        {!isEmpty(data.shipping_method) &&
          data.shipping_method.map((item, index) => {
            return (
              <View
                key={item.method_id}
                style={{flexDirection: "row", width: "100%", alignItems: "center"}}>
                <Text style={{flex: 1}}>{item.shipping_method_name}</Text>
                <HTMLRender
                  html={item.shipping_method_price ? item.shipping_method_price : <b></b>}
                />
                <Button onPress={selectShippingMethod(item)} style={{paddingVertical: 4}}>
                  <Icon
                    name={
                      data.chosen_shipping_method === item.id
                        ? "md-radio-button-on"
                        : "md-radio-button-off"
                    }
                    size={18}
                    style={{marginStart: 5}}
                  />
                </Button>
              </View>
            );
          })}
      </View>
      <View style={styles.card}>
        <Text style={styles.heading}>Order Summary</Text>
        <FlatList data={data.cart_data} renderItem={_renderItem} keyExtractor={_keyExtractor} />
        <Text style={{color: "green"}}>You Save</Text>
        <View style={styles.flexdirection}>
          <Text>Subtotal</Text>
          <HTMLRender html={data.cart_subtotal || "<b></b>"} />
        </View>
        <View style={styles.flexdirection}>
          <Text>Shipping Charge</Text>
          <HTMLRender
            html={
              data.shipping_method.find(item => item.id == data.chosen_shipping_method)
                .shipping_method_price
            }
          />
        </View>
        <View style={styles.flexdirection}>
          <Text style={{color: "green"}}>Total Discount</Text>
          <HTMLRender html={data.discount_total || "<b></b>"} baseFontStyle={{color: "green"}} />
        </View>
        <View style={{height: 1.35, backgroundColor: "#d2d2d2", marginVertical: 10}}></View>
        <View style={styles.flexdirection}>
          <Text style={{fontWeight: "700", color: "grey"}}>Total</Text>
          <HTMLRender html={data.total || "<b></b>"} baseFontStyle={{fontWeight: "700"}} />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.heading}>Payment Method</Text>
      </View>
    </View>
  );
}

Review.navigationOptions = {
  header: <Toolbar backButton title="Review" />,
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: "700",
    marginBottom: 8,
  },
  card: {
    elevation: 2,
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    backgroundColor: "#fff",
    borderRadius: 2,
    padding: 10,
    marginTop: 16,
  },
  flexdirection: {flexDirection: "row", justifyContent: "space-between"},
});

export default Review;
