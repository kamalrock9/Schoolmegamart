import React from "react";
import {View, Dimensions, Image} from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
import FitImage from "react-native-fit-image";

const {width} = Dimensions.get("window");

const renderItem = ({item, index}) => (
  <Image
    style={{width, height: 120, resizeMode: "cover"}}
    source={{uri: item.banner_url || item.src}}
  />
);

const keyExtractor = item => item.id.toString();

function Slider({data, ...props}) {
  return (
    <SwiperFlatList
      {...props}
      data={data}
      nestedScrollEnabled={true}
      paginationActiveColor="black"
      showPagination={data.length > 1 ? true : false}
      paginationStyleItem={{
        width: 10,
        height: 10,
        marginHorizontal: 5,
      }}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      style={{width, marginHorizontal: 16}}
    />
  );
}

export default React.memo(Slider);
