import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from './Text';
import HTML from 'react-native-render-html';

const delRenderer = (htmlAttribs, children, convertedCSSStyles, passProps) => (
  <Text key={passProps.key}>{children} &nbsp;</Text>
);

function HTMLRender({fontSize, fontWeight, color, ...props}) {
  return (
    <HTML
      {...props}
      tagsStyles={{
        del: styles.del,
        ins: styles.ins,
        p: {paddingVertical: 0, fontSize, fontWeight},
        span: {fontSize, fontWeight, color},
      }}
      renderers={{del: delRenderer}}
    />
  );
}

const styles = StyleSheet.create({
  del: {
    textDecorationLine: 'line-through',
    color: '#999999',
    marginLeft: 20,
  },
  ins: {
    color: '#000000',
  },
});
export default HTMLRender;
