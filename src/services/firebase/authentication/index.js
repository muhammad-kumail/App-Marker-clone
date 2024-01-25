import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';
import {errorHandler} from '../../../utils/helper';
export function signUp({email, password, firstName, lastName}) {
  return new Promise(async (resolve, reject) => {
    await auth()
      .createUserWithEmailAndPassword(email?.toLowerCase(), password)
      .then(async userCredential => {
        await userCredential.user.updateProfile({
          displayName: `${firstName} ${lastName}`,
        });
        sendEmailVerification();
        const user = userCredential.user;
        firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            _id: user.uid,
            email: user.email,
            firstName,
            lastName,
            password,
          })
          .then(res => {
            console.log('🚀 ~ User Data successfully added in firestore');
          })
          .catch(err => {
            console.log('🚀 ~ User Data failed to add in firestore:', err);
          });
        resolve({data: userCredential, message: 'User Created Successfully'});
      })
      .catch(error => {
        reject({data: null, message: error.message, code: error.code});
      });
  });
}
export function signIn({email, password}) {
  return new Promise(async (resolve, reject) => {
    await auth()
      .signInWithEmailAndPassword(email?.toLowerCase(), password)
      .then(userCredential => {
        resolve({data: userCredential, message: 'Sign In Successful'});
      })
      .catch(error => {
        reject({data: null, message: error.message, code: error.code});
      });
  });
}
export const onAuthStateChanged = onChange => {
  const unsubscribe = auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      onChange({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        // Add other user information as needed
      });
    } else {
      // No user signed in
      onChange(null);
    }
  });

  // To unsubscribe the listener when it's no longer needed
  return unsubscribe;
};
export const getIdToken = async () => {
  try {
    const user = auth().currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      return Promise.resolve({idToken, message: 'Fetching token successfully'});
    } else {
      return Promise.reject({
        idToken: null,
        message: 'No user logged in',
        code: 'Failed',
      });
    }
  } catch (error) {
    return Promise.reject({
      idToken: null,
      message: error.message,
      code: error.message,
    });
  }
};
export const signOut = async () => {
  await auth()
    .signOut()
    .then(() => {
      return Promise.resolve({message: 'User signOut successfully'});
    })
    .catch(() => {
      return Promise.reject({message: 'Error in signOut user'});
    });
};
export const sendEmailVerification = () => {
  const user = auth().currentUser;
  if (user) {
    user
      .sendEmailVerification()
      .then(() => {
        console.log('Verification email sent');
        Alert.alert('Verification', 'Account verification email sent');
      })
      .catch(error => {
        console.error('Error sending verification email:', error.message);
        const text = errorHandler(error);
        Alert.alert(text.code, text.message);
      });
  } else {
    console.error('No user logged in');
  }
};
export const sendPasswordResetEmail = email => {
  return new Promise(async (resolve, reject) => {
    await auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        resolve({
          message: 'Password reset email sent successfully',
          code: 'Success',
        });
      })
      .catch(error => {
        reject({message: error.message, code: error.code});
      });
  });
};
export const getCurrentUserId = () => {
  const user = auth().currentUser;
  return user ? user?.uid : null;
};
