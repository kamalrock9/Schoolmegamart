import {View, StyleSheet} from "react-native";
import {Text, Icon} from "components";
import React from "react";

function NotificationItem({item, index}) {
  return (
    <View style={[styles.card, {marginTop: index > 0 ? 5 : 10, marginBottom: 5}]}>
      <Icon name="md-notifications" size={24} />
      <View style={{marginStart: 20}}>
        <Text style={styles.text}>{item.title}</Text>
        <Text style={[styles.text, {color: "grey"}]}>{item.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowRadius: 2,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 1},
    elevation: 2,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {lineHeight: 16},
});

export default NotificationItem;
