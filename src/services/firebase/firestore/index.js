// import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {getCurrentUserId} from '../authentication';
import {Alert} from 'react-native';
import {errorHandler} from '../../../utils/helper';

export const uploadFile = async (fileUri, fileName) => {
  const reference = storage().ref(`marker/images/${fileName}`);
  await reference.putFile(fileUri);
  return reference.getDownloadURL();
};

export const deleteFile = fileName => {
  return new Promise(async (resolve, reject) => {
    const reference = storage().ref(`marker/images/${fileName}`);
    await reference
      .delete()
      .then(() => {
        resolve({
          isDeleted: true,
          message: 'File deleted successfully from Firebase Storage',
        });
      })
      .catch(error => {
        reject({isDeleted: false, message: error});
      });
  });
};

export const addMarker = marker => {
  return new Promise(async (resolve, reject) => {
    let userId = getCurrentUserId();
    if (userId) {
      let markerId = uuid();
      firestore()
        .collection('markers')
        .doc(markerId)
        .set({
          _id: markerId,
          userId,
          title: marker.title,
          description: marker.description,
          coordinates: marker.coordinates,
          type: marker.type,
          color: marker.color,
          phone: marker.phone,
          images: marker.images,
          extraInfo: marker.extraInfo,
          updatedAt: marker.updatedAt,
        })
        .then(res => {
          resolve({result: res, message: 'Marker added Successfully'});
        })
        .catch(err => {
          reject({result: err, message: 'Marker adding failed'});
        });
    } else reject({result: null, message: 'No user Logged in'});
  });
};
export const editMarker = marker => {
  return new Promise((resolve, reject) => {
    let userId = getCurrentUserId();
    if (userId) {
      if (!marker._id) {
        reject({result: null, message: 'Marker ID is required for editing'});
      }

      firestore()
        .collection('markers')
        .doc(marker._id)
        .update(marker)
        .then(res => {
          resolve({result: res, message: 'Marker updated successfully'});
        })
        .catch(err => {
          reject({result: err, message: 'Marker updation failed'});
        });
    } else {
      reject({result: null, message: 'No user logged in'});
    }
  });
};
export const deleteMarker = markerId => {
  return new Promise((resolve, reject) => {
    let userId = getCurrentUserId();
    if (userId) {
      firestore()
        .collection('markers')
        .doc(markerId)
        .delete()
        .then(() => {
          resolve({message: 'Marker deleted successfully'});
        })
        .catch(err => {
          reject({result: err, message: 'Marker deletion failed'});
        });
    } else {
      reject({result: null, message: 'No user Logged in'});
    }
  });
};
