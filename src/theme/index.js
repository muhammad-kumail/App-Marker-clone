import {
  responsiveHeight as height,
  responsiveWidth as width,
  responsiveFontSize as fontSize,
} from 'react-native-responsive-dimensions';

import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

export {scale, verticalScale, moderateScale};

export const normalized = {height, width, fontSize};

// eslint-disable-next-line no-undef
export default theme = {
  colors: {
    white: '#fff',
    dimWhite: 'rgba(255,255,255,0.4)',
    offWhite: 'rgba(255,255,255,0.6)',
    black: '#000',
    darkBlack: '#333333',
    transparentBlack: 'rgba(0,0,0,0.8)',
    gray: 'gray',
    darkGray: '#4c4c4c',
    lightGray: '#999999',
    skyBlue: '#00d7fd',
    red: '#ff0000',
  },
  fontFamily: {},
  fontSizes: {
    xxbig: normalized.fontSize(5.92), // Equivalent to 34
    xbig: normalized.fontSize(4.53), // Equivalent to 26
    big: normalized.fontSize(3.77), // Equivalent to 22
    xxmedium: normalized.fontSize(3.23), // Equivalent to 19
    xmedium: normalized.fontSize(2.84), // Equivalent to 17
    medium: normalized.fontSize(2.46), // Equivalent to 15
    small: normalized.fontSize(2.07), // Equivalent to 13
    verySmall: normalized.fontSize(1.69), // Equivalent to 11
    tinySmall: normalized.fontSize(1.3), // Equivalent to 9
  },
};
