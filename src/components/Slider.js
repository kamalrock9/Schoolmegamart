import React from "react";
import {Dimensions} from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
import Image from "./ScaledImage";

class Slider extends React.PureComponent {
    _renderItem = ({item, index}) => {
        return (
            <Image
                source={{uri: item.banner_url || item.src}}
                width={width}
                approxHeight={this.props.approxHeight}
            />
        );
    };
    _keyExtractor = item => item.id.toString();

    render() {
        return (
            <SwiperFlatList
                {...this.props}
                nestedScrollEnabled={true}
                paginationActiveColor="black"
                showPagination={this.props.data.length > 1 ? true : false}
                paginationStyleItem={{
                    width: 10,
                    height: 10,
                    marginHorizontal: 5
                }}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
            />
        );
    }
}

const {width, height} = Dimensions.get("window");

export default Slider;
