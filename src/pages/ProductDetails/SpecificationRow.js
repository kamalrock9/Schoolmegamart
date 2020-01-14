import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../../components";

class SpecificationRow extends React.PureComponent {

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <Text>{this.props.leftContent}</Text>
                </View>
                <View style={{ flex: 2 }}>
                    <Text>{this.props.rightContent}</Text>
                </View>
            </View>
        );
    }
}
export default SpecificationRow;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        minHeight: 28
    }
});
