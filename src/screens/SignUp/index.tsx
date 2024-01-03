// SignUp.js
import {Alert, ImageBackground, View} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SvgXml} from 'react-native-svg';
import {Button, Text, TextInput} from '../../components';
import {images} from '../../utils/constants';
import theme, {scale} from '../../theme';
import {styles} from './styles';
import {logo2} from '../../assets/svgs';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {getIdToken, signUp} from '../../services/firebase/authentication';
import {capitalize, errorHandler} from '../../utils/helper';
import {setToken} from '../../redux/reducer';
import {useDispatch} from 'react-redux';

export default function SignUp({navigation}: any) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: ({confirmPassword, ...values}) => {
      // Handle form submission
      console.log(values);
      setIsLoading(true);
      signUp(values)
        .then(res => {
          console.log(
            '🚀 ~ file: index.tsx:43 ~ signUp ~ res:',
            JSON.stringify(res),
          );
          getIdToken()
            .then(res => {
              console.log('🚀 ~ file: index.tsx:43 ~ getIdToken ~ res:', res);
              dispatch(setToken(res.idToken));
            })
            .catch(err => {
              console.log('🚀 ~ file: index.tsx:45 ~ getIdToken ~ err:', err);
              const text = errorHandler(err);
              Alert.alert(text.code, text.message);
            });
        })
        .catch(err => {
          console.log('🚀 ~ file: index.tsx:46 ~ signUp ~ err:', err.message);
          const text = errorHandler(err);
          Alert.alert(text.code, text.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  return (
    <ImageBackground
      source={images.mapWallpaper}
      style={styles.container}
      blurRadius={10}>
      <KeyboardAwareScrollView
        scrollEnabled={true}
        contentContainerStyle={styles.mainView}>
        <View style={styles.svgView}>
          <SvgXml xml={logo2} height={scale(70)} width={scale(70)} />
        </View>
        <Text style={styles.heading}>Create Account</Text>
        <View style={styles.inputContainer}>
          <TextInput
            iconProps={{
              type: 'ionicon',
              name: 'person-circle',
            }}
            placeholder="Your first name"
            containerStyle={styles.textInputContainer}
            placeholderTextColor={theme.colors.offWhite}
            style={styles.textInput}
            onChangeText={formik.handleChange('firstName')}
            onBlur={formik.handleBlur('firstName')}
            value={formik.values.firstName}
            error={{
              isError: formik.touched.firstName && formik.errors.firstName,
              text: formik.errors.firstName,
            }}
          />

          <TextInput
            iconProps={{
              type: 'ionicon',
              name: 'person-circle',
            }}
            placeholder="Enter last name"
            containerStyle={styles.textInputContainer}
            placeholderTextColor={theme.colors.offWhite}
            style={styles.textInput}
            onChangeText={formik.handleChange('lastName')}
            onBlur={formik.handleBlur('lastName')}
            value={formik.values.lastName}
          />

          <TextInput
            iconProps={{
              type: 'material',
              name: 'email',
            }}
            placeholder="Enter your Email"
            containerStyle={styles.textInputContainer}
            placeholderTextColor={theme.colors.offWhite}
            style={styles.textInput}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            value={formik.values.email}
            error={{
              isError: formik.touched.email && formik.errors.email,
              text: formik.errors.email,
            }}
          />

          <TextInput
            iconProps={{
              type: 'ionicon',
              name: 'key',
            }}
            placeholder="Enter your password"
            containerStyle={styles.textInputContainer}
            placeholderTextColor={theme.colors.offWhite}
            secureTextEntry={true}
            style={styles.textInput}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            value={formik.values.password}
            error={{
              isError: formik.touched.password && formik.errors.password,
              text: formik.errors.password,
            }}
          />

          <TextInput
            iconProps={{
              type: 'ionicon',
              name: 'key',
            }}
            placeholder="Confirm password"
            containerStyle={styles.textInputContainer}
            placeholderTextColor={theme.colors.offWhite}
            secureTextEntry={true}
            style={styles.textInput}
            onChangeText={formik.handleChange('confirmPassword')}
            onBlur={formik.handleBlur('confirmPassword')}
            value={formik.values.confirmPassword}
            error={{
              isError:
                formik.touched.confirmPassword && formik.errors.confirmPassword,
              text: formik.errors.confirmPassword,
            }}
          />

          <Button
            loading={isLoading}
            disabled={isLoading}
            title={'CREATE ACCOUNT'}
            onPress={() => formik.handleSubmit()}
          />

          <View style={styles.bottomTextView}>
            <Text onPress={() => navigation.goBack()}>
              Already have an account? Login
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}
