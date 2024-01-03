import {StyleSheet} from 'react-native';
import theme, {scale, verticalScale} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainView: {
    flexGrow: 1,
    margin: scale(20),
    alignItems: 'center',
    marginVertical: verticalScale(150),
  },
  svgView: {
    backgroundColor: theme.colors.skyBlue,
    borderRadius: scale(200),
  },
  heading: {
    marginVertical: scale(10),
    fontSize: scale(25),
    fontWeight: 'bold',
  },
  textInputContainer: {
    marginVertical: scale(8),
  },
  textInput: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.small,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(5),
  },
});
