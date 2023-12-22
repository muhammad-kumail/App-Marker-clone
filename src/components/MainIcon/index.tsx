import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import theme, {scale} from '../../theme';
import {Icon} from 'react-native-elements';
interface MainIconProps {
  name: string;
  type: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
export default function MainIcon({
  name,
  type,
  size = scale(20),
  color = theme.colors.white,
  style,
  onPress,
}: MainIconProps) {
  return (
    <Icon
      name={name}
      type={type}
      size={size}
      color={color}
      containerStyle={[styles.container, style]}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: scale(15),
    // backgroundColor: theme.colors.transparentBlack,
  },
});
