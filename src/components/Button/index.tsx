import {StyleSheet} from 'react-native';
import React from 'react';
import {Button as ElementButton, ButtonProps} from 'react-native-elements';
import theme, {scale} from '../../theme';

export default function Button(props: ButtonProps) {
  return (
    <ElementButton
      {...props}
      disabledStyle={styles.button}
      containerStyle={styles.container}
      buttonStyle={styles.button}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(30),
    marginVertical: scale(8),
  },
  button: {
    backgroundColor: theme.colors.darkBlack,
    paddingVertical: scale(12),
  },
});
