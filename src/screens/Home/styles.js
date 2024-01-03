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
  centeredElement: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -50}, {translateY: -75}],
  },
  bars: {
    borderRightWidth: 1,
    borderColor: 'gray',
    borderTopLeftRadius: scale(6),
    borderBottomLeftRadius: scale(6),
  },
  topSecondView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: scale(10),
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: scale(10),
    gap: scale(10),
  },
  lowerView: {
    // flexDirection: 'row',
    paddingHorizontal: scale(10),
    paddingBottom: scale(10),
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: scale(8),
  },
  belowBtn: {
    backgroundColor: theme.colors.transparentBlack,
    padding: scale(15),
    paddingVertical: scale(17),
    borderRadius: scale(5),
    marginHorizontal: scale(5),
  },
  belowDescription: {
    backgroundColor: theme.colors.transparentBlack,
    padding: scale(15),
    paddingVertical: scale(5),
    borderRadius: scale(5),
    marginHorizontal: scale(5),
  },
});
