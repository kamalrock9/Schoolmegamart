import React, {Component} from "react";
import {View, TouchableOpacity} from "react-native";
import Text from "./Text";

class QuantitySelector extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor: "#f6f6f6",
            borderWidth: 1.5,
            borderRadius: 4,
            borderColor: "#efefef",
          }}
          onPress={this.props.minusClick}>
          <Text style={{fontSize: 22}}>-</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            width: 30,
            fontWeight: "600",
            textAlign: "center",
          }}>
          {this.props.quantity}
        </Text>
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            //backgroundColor: "#f6f6f6",
            borderWidth: 1.5,
            borderRadius: 4,
            borderColor: "#efefef",
          }}
          onPress={this.props.plusClick}>
          <Text style={{fontSize: 22}}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default QuantitySelector;
