import React, {useState} from "react";
import {View, StyleSheet, Image, ActivityIndicator, Dimensions} from "react-native";
import {Button, Text, Icon, HTMLRender} from "components";
import {ApiClient} from "service";
import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import {useSelector} from "react-redux";

const {height} = Dimensions.get("window");

function CartItem({item, index, quantityIncrementDecremnt}) {
  //console.log(item);

  const appSetting = useSelector(state => state.appSettings);

  const [isOpenModal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeModal = (item, itemEach) => () => {
    if (item == "false") {
      setModal(false);
    } else {
      console.log("delete");
      setModal(false);
      deleteItem(itemEach);
    }
  };

  const openModal = () => {
    setModal(true);
  };

  const decrement = (itemEach, index) => () => {
    let data = {
      cart_item_key: itemEach.cart_item_key,
      quantity: parseInt(itemEach.quantity) - 1,
    };
    if (itemEach.quantity > 1) {
      setLoading(true);
      ApiClient.get("/cart/update", data)
        .then(response => {
          setLoading(false);
          quantityIncrementDecremnt && quantityIncrementDecremnt();
        })
        .catch(error => {
          setLoading(false);

          console.log(error);
        });
    } else {
      Toast.show("Minimum item quantity reached");
    }
  };

  const increment = (itemEach, index) => () => {
    let data = {
      cart_item_key: itemEach.cart_item_key,
      quantity: parseInt(itemEach.quantity) + 1,
    };
    if (itemEach.quantity > 0) {
      setLoading(true);

      ApiClient.get("/cart/update", data)
        .then(response => {
          setLoading(false);
          quantityIncrementDecremnt && quantityIncrementDecremnt();
        })
        .catch(error => {
          setLoading(false);

          console.log(error);
        });
    }
  };

  const deleteItem = itemEach => {
    console.log("kamal");
    let data = {
      cart_item_key: itemEach.cart_item_key,
    };
    setLoading(true);

    ApiClient.get("/cart/remove", data)
      .then(response => {
        setLoading(false);

        console.log(response);
        quantityIncrementDecremnt && quantityIncrementDecremnt();
      })
      .catch(error => {
        setLoading(false);

        console.log(error);
      });
  };

  if (loading) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  } else {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            width: "100%",
            paddingTop: index == 0 ? 16 : 0,
            paddingHorizontal: 16,
          }}>
          <Image
            style={{height: 70, width: 70}}
            source={{
              uri: item.image,
            }}
          />
          <View style={{marginStart: 16, flex: 1}}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <Text style={{fontWeight: "700"}}>{item.name}</Text>
              <Button onPress={openModal}>
                <Icon type="MaterialIcons" name="delete" size={22} />
              </Button>
            </View>
            <HTMLRender html={item.product_desc} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                marginTop: 10,
              }}>
              <Text>Price:</Text>
              <HTMLRender html={item.subtotal} />
              <View style={{flexDirection: "row"}}>
                <Button style={styles.btn} onPress={decrement(item, index)}>
                  <Text style={styles.btnTxt}>–</Text>
                </Button>
                <Text style={{paddingHorizontal: 8}}>{item.quantity}</Text>
                <Button style={styles.btn} onPress={increment(item, index)}>
                  <Text style={styles.btnTxt}>+</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
        <Modal
          isVisible={isOpenModal}
          style={{margin: 0}}
          onBackButtonPress={closeModal("false", null)}
          onBackdropPress={closeModal("false", null)}
          useNativeDriver
          hideModalContentWhileAnimating>
          <View style={{backgroundColor: "#fff", marginHorizontal: 64, padding: 20}}>
            <Text style={{fontWeight: "500", fontSize: 20, marginBottom: 15}}>
              Remove From Cart
            </Text>
            <Text>Are you sure to remove this?</Text>
            <View style={{flexDirection: "row", justifyContent: "flex-end", marginTop: 30}}>
              <Button onPress={closeModal("false", null)}>
                <Text style={{color: appSetting.accent_color}}>NO</Text>
              </Button>
              <Button onPress={closeModal("item", item)} style={{marginStart: 20}}>
                <Text style={{color: appSetting.accent_color}}>YES</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    borderWidth: 1,
    borderColor: "#D2d2d9",
    backgroundColor: "#D2d2d2",
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {fontWeight: "700"},
  footer: {
    width: "100%",
    flexDirection: "row",
  },
  footerButton: {
    flex: 1,
    height: 40,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  line: {
    height: 1,
    width: "100%",
    backgroundColor: "#F1F1F1",
  },
  btnTxt: {
    fontWeight: "600",
    fontSize: 24,
    marginBottom: 5,
  },
});

export default CartItem;
