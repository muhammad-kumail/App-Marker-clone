// import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {getCurrentUserId} from '../authentication';
import {Alert} from 'react-native';
import {errorHandler} from '../../../utils/helper';
import { useEffect } from 'react';

export const uploadFile = (fileUri, fileName, onProgress) => {
  const reference = storage().ref(`marker/images/${fileName}`);
  const task = reference.putFile(fileUri);

  return new Promise((resolve, reject) => {
    task.on(
      storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      reject, // Reject on error
      async () => {
        try {
          const downloadURL = await reference.getDownloadURL();
          console.log('🚀 ~ downloadURL:', downloadURL);
          resolve(downloadURL); // Resolve the promise with the download URL
        } catch (error) {
          reject(error); // Reject the promise on error
        }
      },
    );
  });
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

export const addMarker = async marker => {
  //console.log('marker images >>>>>>>>>>.', marker.downloadUrls);
  try {
    const userId = await getCurrentUserId();
    //console.log('🚀 ~ addMarker ~ userId:', userId);

    if (userId) {
      const markerId = uuid();
      firestore().collection('markers').doc(markerId).set({
        _id: markerId,
        userId,
        title: marker.title,
        description: marker.description,
        coordinates: marker.coordinates,
        type: marker.type,
        color: marker.color,
        phone: marker.phone,
        // images: marker.images,
        downloadUrls: marker.downloadUrls,
        extraInfo: marker.extraInfo,
        updatedAt: marker.updatedAt,
      });
      console.log(
        'marker.downloadUrls >>>>>>>>>',
        marker.downloadUrls,
        marker.title,
        marker.description,
        marker.coordinates,
        marker.type,
        marker.color,
        marker.phone,
        //marker.images,
        marker.downloadUrls,
        marker.extraInfo,
        marker.updatedAt,
      );
      return {
        result: 'Marker added Successfully',
        message: 'Marker added Successfully',
      };
    } else {
      throw {result: null, message: 'No user Logged in'};
    }
  } catch (error) {
    console.error('Error adding marker:', error?.message);
    throw {result: error, message: 'Marker adding failed'};
  }
};


export const getAllMarkersTitles = async () => {
  try {
    const markersCollection = await firestore().collection('markers').get();

    if (!markersCollection.empty) {
      const titles = markersCollection?.docs?.map(doc => {
        const markerData = doc?.data();
        return markerData?.title;
      });

      return titles;
    } else {
      throw {result: null, message: 'No markers found'};
    }
  } catch (error) {
    console.log('Error getting markers titles:', error?.message);
    throw {result: error, message: 'Failed to get markers titles'};
  }
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
