import React from 'react';
import {Text as RNText, StyleSheet} from 'react-native';

const fonts = {
  Montserrat: {
    fontWeights: {
      100: 'Thin',
      200: 'ExtraLight',
      300: 'Light',
      400: 'Regular',
      500: 'Medium',
      600: 'SemiBold',
      700: 'Bold',
      800: 'ExtraBold',
      900: 'Black',
      normal: 'Regular',
      bold: 'Bold',
    },
    fontStyles: {
      normal: '',
      italic: 'Italic',
    },
  },
};

const getFontFamily = (baseFontFamily, styles = {}) => {
  const {fontWeight, fontStyle} = styles;
  const font = fonts[baseFontFamily];

  if (!font) {
    throw new Error(`Font '${baseFontFamily}' is not supported.`);
  }

  const weight = fontWeight
    ? font.fontWeights[fontWeight]
    : font.fontWeights.normal;

  if (typeof weight === 'undefined') {
    throw new Error(
      `Font '${baseFontFamily}' is not configured for a font weight of '${fontWeight}'.`,
    );
  }

  const style = fontStyle ? font.fontStyles[fontStyle] : font.fontStyles.normal;

  if (typeof style === 'undefined') {
    throw new Error(
      `Font '${baseFontFamily}' is not configured for a font style of '${fontStyle}'.`,
    );
  }

  if (style === font.fontStyles.italic && weight === font.fontWeights.normal) {
    return `${baseFontFamily}-${style}`;
  }

  return `${baseFontFamily}-${weight}${style}`;
};

class Text extends React.PureComponent {
  render() {
    const resolvedStyle = {...StyleSheet.flatten(this.props.style)};
    resolvedStyle.fontFamily = resolvedStyle.fontFamily
      ? getFontFamily(resolvedStyle.fontFamily, resolvedStyle)
      : getFontFamily('Montserrat', resolvedStyle);
    delete resolvedStyle.fontStyle;
    delete resolvedStyle.fontWeight;

    return (
      <RNText {...this.props} style={resolvedStyle}>
        {this.props.children}
      </RNText>
    );
  }
}

export default Text;
