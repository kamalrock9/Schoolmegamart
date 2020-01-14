import React, {Fragment} from "react";
import {View} from "react-native";
import {Button, Icon} from "native-base";
import {withNavigation} from "react-navigation";
import {Text} from "../../components";

class MiniCart extends React.PureComponent {
    _goToHome = () => {
        this.props.close();
        this.props.navigation.navigate("Home");
    };
    _goToCart = () => {
        this.props.close();
        this.props.navigation.navigate("Cart");
    };

    render() {
        return (
            // <View></View>
            <Fragment>
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                    <Button transparent>
                        <Icon name="md-checkmark" />
                    </Button>
                    <Text style={{color: "#000000", fontSize: 18}}>
                        Added to cart
                    </Text>
                    <Button
                        transparent
                        style={{marginLeft: "auto"}}
                        onPress={this.props.close}>
                        <Icon name="md-close" />
                    </Button>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderRadius: 1,
                        borderStyle: "dashed",
                        borderColor: "#757575",
                        paddingHorizontal: 10,
                        paddingVertical: 15,
                        marginHorizontal: 30
                    }}>
                    <Text>{this.props.message}</Text>
                </View>
                <View
                    style={{
                        borderTopWidth: 0.8,
                        borderTopColor: "#dedede"
                    }}>
                    <View style={{flexDirection: "row", width: "100%"}}>
                        <Button
                            onPress={this.props.close}
                            transparent
                            style={{
                                flex: 1,
                                justifyContent: "center"
                            }}>
                            <Text style={{fontWeight: "500"}}>
                                CONTINUE BROWSING
                            </Text>
                        </Button>
                        <View
                            style={{
                                width: 1,
                                backgroundColor: "#dedede"
                            }}
                        />
                        <Button
                            onPress={this._goToHome}
                            transparent
                            style={{
                                flex: 1,
                                justifyContent: "center"
                            }}>
                            <Text style={{fontWeight: "500"}}>GO TO HOME</Text>
                        </Button>
                    </View> 
                    <Button
                        onPress={this._goToCart}
                        style={{
                            backgroundColor: this.props.appSettings
                                .accent_color,
                            justifyContent: "center",
                            width: "100%"
                        }}>
                        <Text style={{color: "white"}}>GO TO CART()</Text>
                    </Button>
                </View>
            </Fragment>
        );
    }
}
export default withNavigation(MiniCart);
