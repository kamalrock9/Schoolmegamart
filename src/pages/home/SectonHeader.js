import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Icon } from "components";

class SectonHeader extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  _handleOnPress = () => {
    if (this.props.onPress) {
      this.props.onPress(...this.props.onPressArgs);
    }
  };
  render() {
    const { icon, title, titleEnd, style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>{title}</Text>
        <Button onPress={this._handleOnPress} style={styles.rightButton}>
          <Text style={{ color: "#0275f9",fontSize:12 }}>{titleEnd}</Text>
          <Icon name={icon} style={{ fontSize: 16, marginStart: 8,  }} color="#0275f9" />
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "space-between",
    marginTop: 16,
  },
  title: {
    fontWeight: "600",
  },
  rightButton: {
    paddingVertical: 16,
    marginStart: "auto",
    flexDirection: "row",
  },
});

// SectonHeader.propTypes = {
//     source: PropTypes.object.isRequired,
//     width: PropTypes.number,
//     height: PropTypes.number,
//     style: PropTypes.object
// };

SectonHeader.defaultProps = {
  onPressArgs: [],
  icon: "md-arrow-forward",
};

export default SectonHeader;
