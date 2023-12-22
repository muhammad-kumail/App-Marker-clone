import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import theme, {scale} from '../../theme';
import {globalStyles} from '../../globalStyles';
import {Icon} from 'react-native-elements';

interface CircularButtonProps {
  icon: {
    name: string;
    type: string;
    size?: number;
    color?: string;
  };
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

export default function CircularButton({
  icon,
  style,
  onPress,
  disabled,
}: CircularButtonProps) {
  return (
    <View style={globalStyles.setCenter}>
      <View style={[styles.container, style]}>
        <Icon
          name={icon.name}
          type={icon.type}
          color={icon.color ? icon.color : theme.colors.white}
          size={icon.size ? icon.size : scale(25)}
          disabled={disabled}
          onPress={onPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: scale(18),
    backgroundColor: theme.colors.darkBlack,
    borderRadius: scale(100),
    elevation: 3,
    shadowOffset: {width: 3, height: 3},
    shadowColor: theme.colors.darkBlack,
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
});
