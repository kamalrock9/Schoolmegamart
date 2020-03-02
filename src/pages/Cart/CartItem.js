import React, {useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Button, Text, Icon} from '../../components';
import HTML from 'react-native-render-html';
import {ApiClient} from '../../service';
import Modal from 'react-native-modal';

function CartItem({item, index, quantityIncrementDecremnt}) {
  //console.log(item);

  const [isOpenModal, setModal] = useState(false);

  const closeModal = (item, itemEach) => () => {
    if (item == false) {
      setModal(false);
    } else {
      setModal(false);
      //deleteItem(itemEach);
    }
  };

  const openModal = () => () => {
    console.log('hey');
    setModal(true);
  };

  const decrement = (itemEach, index) => () => {
    let data = {
      cart_item_key: itemEach.cart_item_key,
      quantity: parseInt(itemEach.quantity) - 1,
    };
    if (itemEach.quantity > 1) {
      ApiClient.get('/cart/update', data)
        .then(response => {
          console.log(response);
          quantityIncrementDecremnt && quantityIncrementDecremnt();
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const increment = (itemEach, index) => () => {
    let data = {
      cart_item_key: itemEach.cart_item_key,
      quantity: parseInt(itemEach.quantity) + 1,
    };
    if (itemEach.quantity > 0) {
      ApiClient.get('/cart/update', data)
        .then(response => {
          console.log(response);
          quantityIncrementDecremnt && quantityIncrementDecremnt();
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const deleteItem = itemEach => () => {
    console.log('kamal');
    let data = {
      cart_item_key: itemEach.cart_item_key,
    };
    ApiClient.get('/cart/remove', data)
      .then(response => {
        console.log(response);
        quantityIncrementDecremnt && quantityIncrementDecremnt();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          width: '100%',
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
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontWeight: '700'}}>{item.name}</Text>
            <Button onPress={openModal}>
              <Icon type="MaterialIcons" name="delete" size={22} />
            </Button>
          </View>
          <Text>{item.product_desc}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              marginTop: 10,
            }}>
            <Text>Price:</Text>
            <HTML html={item.subtotal} />
            <View style={{flexDirection: 'row'}}>
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
        onBackButtonPress={closeModal('false', null)}
        useNativeDriver
        hideModalContentWhileAnimating>
        <View>
          <Text>Remove From Cart</Text>
          <Text>Are you sure to remove this?</Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Button onPress={closeModal('false', null)}>
              <Text>No</Text>
            </Button>
            <Button onPress={closeModal('item', item)}>
              <Text>Yes</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#D2d2d9',
    backgroundColor: '#D2d2d2',
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {fontWeight: '700'},
  footer: {
    width: '100%',
    flexDirection: 'row',
  },
  footerButton: {
    flex: 1,
    height: 40,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#F1F1F1',
  },
  btnTxt: {
    fontWeight: '600',
    fontSize: 24,
    marginBottom: 5,
  },
});

export default CartItem;
