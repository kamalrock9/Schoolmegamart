import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from './Text';
import HTML from 'react-native-render-html';

class Html extends React.PureComponent {
  delRenderer = (htmlAttribs, children, convertedCSSStyles, passProps) => (
    <Text key={passProps.key}>{children} &nbsp;</Text>
  );
  render() {
    return (
      <HTML
        {...this.props}
        tagsStyles={{
          del: {
            textDecorationLine: 'line-through',
            color: '#999999',
            marginLeft: 20,
          },
          ins: {color: 'black', color: '#000000'},
          p: StyleSheet.flatten([
            {paddingVertical: 0},
            this.props.fontSize ? {fontSize: this.props.fontSize} : null,
            this.props.fontWeight ? {fontWeight: this.props.fontWeight} : null,
          ]),
          span: StyleSheet.flatten([
            this.props.fontSize ? {fontSize: this.props.fontSize} : null,
            this.props.fontWeight ? {fontWeight: this.props.fontWeight} : null,
            this.props.color ? {color: this.props.color} : null,
          ]),
        }}
        renderers={{del: this.delRenderer}}
      />
    );
  }
}
export default Html;
