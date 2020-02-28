import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Button, Text, Icon} from '../../components';

function CartItem({item, index}) {
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
            uri:
              'https://media.gettyimages.com/photos/vintage-clothes-on-clothes-rail-in-antique-and-vintage-emporium-picture-id748316031?s=612x612',
          }}
        />
        <View style={{marginStart: 16, flex: 1}}>
          <Text style={{fontWeight: '700'}}>{item.name}</Text>
          <Text>This is simple product</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              marginTop: 10,
            }}>
            <Text>Price: $35.00</Text>
            <View style={{flexDirection: 'row'}}>
              <Button style={styles.btn}>
                <Text style={styles.btnTxt}>–</Text>
              </Button>
              <Text style={{paddingHorizontal: 8}}>1</Text>
              <Button style={styles.btn}>
                <Text style={styles.btnTxt}>+</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
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
