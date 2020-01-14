import React from "react";
import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { Header } from 'react-navigation';

class FlatListLoading extends React.PureComponent {
    render() {
        if (this.props.bottomIndicator || this.props.centerIndicator) {
            return (
                <View style={[
                    styles.container,
                    this.props.centerIndicator ? { height: height - Header.HEIGHT } : { height: 50 }
                ]} >
                    <ActivityIndicator />
                </View>
            );
        } else {
            return null;
        }
    }
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default FlatListLoading; 