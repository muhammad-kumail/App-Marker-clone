import {StyleSheet} from 'react-native';
import theme from '../theme';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    // zIndex: 1,
  },
  setCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.black,
    fontSize: theme.fontSizes.small,
  },
});
