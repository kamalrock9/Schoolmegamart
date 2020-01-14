import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { addWishlist, deleteWishlist } from "../../store/actions";
import { Button, Icon } from "native-base";

class WishlistIcon extends React.PureComponent {
    _handleWishlist = () => {
        if (this.props.wishlist.some(el => el.id == this.props.item.id)) {
            this.props.deleteWishlist(this.props.item.id);
        } else {
            this.props.addWishlist(this.props.item);
        }
    };

    isWishlist = () => {
        return this.props.wishlist.some(el => el.id == this.props.item.id);
    };

    render() {
        return (
            <Button
                transparent
                style={StyleSheet.flatten(this.props.style)}
                onPress={this._handleWishlist}
            >
                <Icon
                    name={this.isWishlist() ? "heart" : "heart-outline"}
                    type="MaterialCommunityIcons"
                    style={{
                        color: this.props.appSettings.accent_color,
                        marginStart: 8,
                        marginEnd: 8
                    }}
                />
            </Button>
        );
    }
}

mapStateToProps = state => ({
    appSettings: state.appSettings,
    wishlist: state.wishlist
});

mapDispatchToProps = {
    addWishlist,
    deleteWishlist
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WishlistIcon);
