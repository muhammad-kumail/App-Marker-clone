import {
  Alert,
  ImageBackground,
  Platform,
  ScrollView,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {styles} from './styles';
import {images} from '../../utils/constants';
import theme, {scale, verticalScale} from '../../theme';
import {SvgXml} from 'react-native-svg';
import {logo, logo2} from '../../assets/svgs';
import {Button, Text, TextInput} from '../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {
  getIdToken,
  sendPasswordResetEmail,
  signIn,
} from '../../services/firebase/authentication';
import {errorHandler} from '../../utils/helper';
import {useDispatch} from 'react-redux';
import {setToken, setUser} from '../../redux/reducer';
import Dialog from 'react-native-dialog';

export default function Login({navigation}: any) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [isDialog, setIsDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const passRef = useRef<RNTextInput>(null);
  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      // Handle form submission
      setIsLoading(true);
      signIn(values)
        .then(res => {
          console.log(
            '🚀 ~ file: index.tsx:36 ~ signIn ~ res:',
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
          console.log('🚀 ~ file: index.tsx:37 ~ signIn ~ err:', err);
          const text = errorHandler(err);
          Alert.alert(text.code, text.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
      console.log(values);
    },
  });
  const openInputDialog = () => {
    return (
      <Dialog.Container visible={isDialog}>
        <Dialog.Title>Email</Dialog.Title>
        <Dialog.Description>
          Enter email to get password reset link
        </Dialog.Description>
        <Dialog.Input onChangeText={e => setEmail(e)} value={email} />
        <Dialog.Button label="Cancel" onPress={() => setIsDialog(false)} />
        <Dialog.Button
          label="Send"
          onPress={() => {
            sendPasswordResetEmail(email)
              .then(res => {
                console.log(
                  '🚀 ~ file: index.tsx:85 ~ sendPasswordResetEmail ~ res:',
                  res,
                );
                Alert.alert(res?.code, res?.message);
              })
              .catch(err => {
                console.log(
                  '🚀 ~ file: index.tsx:89 ~ sendPasswordResetEmail ~ err:',
                  err,
                );
                const text = errorHandler(err);
                Alert.alert(text?.code, text?.message);
              })
              .finally(() => {
                setIsDialog(false);
              });
          }}
        />
      </Dialog.Container>
    );
  };
  return (
    <ImageBackground
      source={images.mapWallpaper}
      style={styles.container}
      blurRadius={10}>
      <KeyboardAwareScrollView
        scrollEnabled={true}
        contentContainerStyle={styles.mainView}>
        {openInputDialog()}
        <View style={styles.svgView}>
          <SvgXml xml={logo2} height={scale(70)} width={scale(70)} />
        </View>
        <Text style={styles.heading}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            iconProps={{
              type: 'material',
              name: 'email',
            }}
            error={{
              isError: formik.touched.email && formik.errors.email,
              text: formik.errors.email,
            }}
            placeholder="Enter your Email"
            containerStyle={styles.textInputContainer}
            placeholderTextColor={theme.colors.offWhite}
            style={styles.textInput}
            onSubmitEditing={() => passRef.current?.focus()}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            value={formik.values.email}
          />
          <TextInput
            ref={passRef}
            iconProps={{
              type: 'ionicon',
              name: 'key',
            }}
            error={{
              isError: formik.touched.password && formik.errors.password,
              text: formik.errors.password,
            }}
            placeholder="Enter your password"
            containerStyle={styles.textInputContainer}
            placeholderTextColor={theme.colors.offWhite}
            style={styles.textInput}
            onChangeText={formik.handleChange('password')}
            onSubmitEditing={() => formik.handleSubmit()}
            onBlur={formik.handleBlur('password')}
            value={formik.values.password}
            secureTextEntry={true}
          />
          <Button
            loading={isLoading}
            disabled={isLoading}
            title={'LOGIN'}
            onPress={() => formik.handleSubmit()}
          />
          <View style={styles.bottomTextView}>
            <Text onPress={() => navigation.navigate('SignUp')}>
              Create Account
            </Text>
            <Text onPress={() => setIsDialog(true)}>Forgot password?</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}
