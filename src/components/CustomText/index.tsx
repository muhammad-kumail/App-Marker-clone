import {StyleSheet, Text, TextProps} from 'react-native';
import React from 'react';
import theme from '../../theme';

export default function CustomText({...props}: TextProps) {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.white,
  },
});
