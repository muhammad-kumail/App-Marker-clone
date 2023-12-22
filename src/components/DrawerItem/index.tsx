import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import theme, {scale} from '../../theme';
import {Icon} from 'react-native-elements';
import CustomText from '../CustomText';
interface DrawerItemProps {
  icon: ReactNode;
  title: string;
  description?: string;
  isSelected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function DrawerItem({
  icon,
  title,
  description,
  isSelected,
  onPress,
  style,
}: DrawerItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{padding: 5}}>
      <View
        style={[styles.container, style, isSelected && styles.selectedView]}>
        <View style={styles.iconView}>{icon}</View>
        <View style={styles.textView}>
          <CustomText style={styles.title}>{title}</CustomText>
          {description && (
            <CustomText style={styles.subTitle}>{description}</CustomText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.colors.gray,
  },
  iconView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(10),
  },
  textView: {
    flex: 4,
    justifyContent: 'center',
    gap: scale(3),
  },
  title: {
    fontSize: theme.fontSizes.small,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: theme.fontSizes.verySmall,
  },
  selectedView: {
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: scale(5),
    backgroundColor: theme.colors.black,
  },
});
