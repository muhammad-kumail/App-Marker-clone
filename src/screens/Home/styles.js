import {StyleSheet} from 'react-native';
import theme, {scale} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topView: {
    flexDirection: 'row',
    padding: scale(10),
    alignItems: 'center',
  },
  topInnerView: {
    flexDirection: 'row',
    backgroundColor: theme.colors.transparentBlack,
    borderRadius: scale(6),
    left: scale(0),
  },
});
