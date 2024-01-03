import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import theme, {scale} from '../../theme';
import {Icon, IconProps} from 'react-native-elements';
import CustomText from '../CustomText';

interface ErrorProps {
  isError: boolean | string | undefined;
  text?: string;
  color?: string;
}

interface CustomInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  iconProps: IconProps;
  error?: ErrorProps;
}
export default function CustomInput({
  containerStyle,
  iconProps,
  error,
  ...props
}: CustomInputProps) {
  const [secure, setSecure] = useState<boolean>(false);
  useEffect(() => {
    if (props.secureTextEntry) {
      setSecure(true);
    }
  }, []);
  return (
    <View style={{width: '100%'}}>
      <View style={[styles.container, containerStyle]}>
        <Icon
          {...iconProps}
          color={iconProps.color || theme.colors.white}
          size={iconProps.size || scale(25)}
          containerStyle={[styles.icon, iconProps.containerStyle]}
        />
        <TextInput
          {...props}
          style={[{flex: 1}, props.style]}
          secureTextEntry={secure}
        />
        {props.secureTextEntry === true && (
          <Icon
            type="ionicon"
            name={secure ? 'eye-off' : 'eye'}
            color={theme.colors.white}
            size={scale(25)}
            containerStyle={[styles.icon]}
            onPress={() => setSecure(!secure)}
          />
        )}
      </View>
      {error?.isError && (
        <CustomText
          style={[
            styles.errorText,
            error?.isError == true &&
              error?.color !== undefined && {color: error.color},
          ]}>
          {error?.text ? `${error?.text}` : 'Your error message'}
        </CustomText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: scale(30),
    backgroundColor: theme.colors.dimWhite,
    width: '100%',
  },
  icon: {
    margin: scale(10),
  },
  errorText: {
    marginLeft: scale(5),
    color: theme.colors.red,
    fontSize: theme.fontSizes.verySmall,
  },
});
