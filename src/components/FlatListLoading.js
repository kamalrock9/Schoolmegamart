import React from 'react';
import {View, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import {Header} from 'react-navigation-stack';

const {height} = Dimensions.get('window');

function FlatListLoading({bottomIndicator, centerIndicator}) {
  if (bottomIndicator || centerIndicator) {
    const viewHeight = centerIndicator ? height - Header.HEIGHT : 50;
    return (
      <View style={[styles.container, {height: viewHeight}]}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FlatListLoading;
