import React from "react";
import FastImage from "react-native-fast-image";
import PropTypes from "prop-types";

class ScaledImage extends React.PureComponent {
  constructor(props) {
    super(props);
    const {source, width, height, approxHeight} = this.props;
    this.state = {
      source: source,
      width: width || height,
      height: approxHeight || height || width,
    };
  }
  _handleImageOnLoad = value => {
    const {height, width} = value.nativeEvent;
    if (this.props.width && !this.props.height) {
      this.setState({
        width: this.props.width,
        height: height * (this.props.width / width),
      });
    } else if (!this.props.width && this.props.height) {
      this.setState({
        width: width * (this.props.height / height),
        height: this.props.height,
      });
    } else {
      this.setState({width: width, height: height});
    }
  };

  render() {
    return (
      <FastImage
        source={this.state.source}
        onLoad={this._handleImageOnLoad}
        resizeMode="contain"
        style={{
          ...this.props.style,
          height: this.state.height,
          width: this.state.width,
        }}
      />
    );
  }
}

ScaledImage.propTypes = {
  source: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
};
export default ScaledImage;
