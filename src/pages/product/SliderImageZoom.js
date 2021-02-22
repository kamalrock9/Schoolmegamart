import React from "react";
import {Image, StyleSheet, Modal, useWindowDimensions} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import {Button, Container, Icon} from "components";
import {useSelector} from "react-redux";

function SliderImageZoom({navigation}) {
  const {width, height} = useWindowDimensions();
  const {params} = navigation.state;
  const images = params.map(image => {
    image.url = image.src;
    return image;
  });

  const {primary_color} = useSelector(state => state.appSettings);

  console.log(images);

  const goBack = () => {
    navigation.goBack(null);
  };

  return (
    <Container style={[styles.container, {backgroundColor: "#fff"}]}>
      <Button onPress={goBack} style={{padding: 16, backgroundColor: "#fff"}}>
        <Icon color={"#000"} name="cross" type="Entypo" size={24} />
      </Button>
      <ImageViewer backgroundColor={"#fff"} renderIndicator={() => {}} imageUrls={images} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.memo(SliderImageZoom);
