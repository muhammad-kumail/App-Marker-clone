import {Dimensions, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {globalStyles} from '../../globalStyles';
import theme, {scale} from '../../theme';
import {Icon} from 'react-native-elements';
import {CircularButton, MainIcon, Text} from '../../components';
import {styles} from './styles';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import {onAuthStateChanged} from '../../services/firebase/authentication';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../redux/reducer';
import {SvgXml} from 'react-native-svg';
import {calebrateMarker} from '../../assets/svgs';

export default function Home({navigation}: any) {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);
  console.log('🚀 ~ file: index.tsx:18 ~ Home ~ token:', token);
  const mapRef = useRef<MapView>(null);
  const {width, height} = Dimensions.get('window');
  const [isMarker, setisMarker] = useState<boolean>(false);
  const [currentpos, setCurrentPos] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [myPosition, setMyPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [watchId, setWatchId] = useState<number>(0);
  const [isDrawer, setIsDrawer] = useState<boolean>(false);
  useEffect(() => {
    Geolocation.getCurrentPosition(pos => {
      const {latitude, longitude} = pos.coords;

      setMyPosition({
        latitude,
        longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1 * (width / height),
      });
    });
    const wId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setMyPosition({...myPosition, latitude, longitude});
      },
      error => {
        console.log('Failed', error.code, error.message);
      },
      {enableHighAccuracy: true, distanceFilter: 10},
    );
    setWatchId(wId);
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((newUser: any) => {
      console.log('🚀 ~ file: index.tsx:62 ~ unsubscribe ~ newUser:', newUser);
      dispatch(setUser(newUser));
    });
    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  return (
    <View style={[globalStyles.container]}>
      {myPosition.latitude !== 0 && myPosition.longitude !== 0 && (
        <MapView
          onPress={e => console.log('e:', e.nativeEvent.coordinate)}
          ref={mapRef}
          // provider={PROVIDER_GOOGLE}
          onRegionChange={e => {
            console.log('region change:', e);
            setCurrentPos(e);
          }}
          // scrollDuringRotateOrZoomEnabled={true}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}
          initialRegion={{
            latitude: myPosition?.latitude,
            longitude: myPosition?.longitude,
            latitudeDelta: myPosition.latitudeDelta,
            longitudeDelta: myPosition.longitudeDelta,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          followsUserLocation={true}
          loadingEnabled={true}
          showsCompass={true}
          scrollEnabled={true}
          onTouchMove={e => console.log('e2:', e.nativeEvent)}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}>
          {/* <Marker
            // draggable
            title={'Test location'}
            description={'Test location description'}
            // style={{height: 40, width: 40}}
            pinColor={'lime'}
            coordinate={currentpos}
            // onDragEnd={e =>
            //   console.log('marker drag end:', e.nativeEvent.coordinate)
            // }
          /> */}
        </MapView>
      )}
      {isMarker && (
        <SvgXml
          style={styles.centeredElement}
          xml={calebrateMarker}
          height={scale(100)}
          width={scale(100)}
        />
      )}
      <View>
        <View
          style={[
            styles.topView,
            isMarker && {backgroundColor: theme.colors.transparentBlack},
          ]}>
          {!isMarker && (
            <View style={styles.topInnerView}>
              <MainIcon
                name="bars"
                type="font-awesome"
                style={styles.bars}
                onPress={() => navigation.openDrawer()}
              />
              <MainIcon name="filter-sharp" type="ionicon" />
              <MainIcon name="list-sharp" type="ionicon" />
              <MainIcon name="search-sharp" type="ionicon" />
              <MainIcon
                name="ios-share"
                type="material"
                style={{
                  borderTopRightRadius: scale(6),
                  borderBottomRightRadius: scale(6),
                }}
              />
            </View>
          )}
          <Text style={{textAlign: 'center'}}>
            Move the map around to place your marker where you want and click OK
            to place it.
          </Text>
        </View>
        <View style={styles.topSecondView}>
          <CircularButton
            icon={{name: 'map-marker-circle', type: 'material-community'}}
            style={{
              display: isMarker ? 'none' : 'flex',
              padding: scale(12),
              transform: [{rotate: '180deg'}],
            }}
          />
          <View
            style={[
              {display: !isMarker ? 'none' : 'flex'},
              styles.belowDescription,
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: scale(8),
              },
            ]}>
            <Icon
              type="font-awesome"
              name="folder"
              size={scale(20)}
              color={theme.colors.gray}
              containerStyle={{marginRight: scale(5)}}
            />
            <Text>Default folder</Text>
          </View>
          <CircularButton
            icon={{name: 'my-location', type: 'material'}}
            onPress={() => {
              mapRef.current?.animateToRegion(myPosition, 600);
            }}
          />
        </View>
      </View>
      <View style={styles.centerView}>
        {isMarker && (
          <>
            <CircularButton
              icon={{name: 'analytics-outline', type: 'ionicon'}}
              style={{alignSelf: 'baseline'}}
            />
            <CircularButton
              icon={{name: 'vector-polygon', type: 'material-community'}}
              style={{alignSelf: 'baseline'}}
            />
            <CircularButton
              icon={{name: 'vector-circle-variant', type: 'material-community'}}
              style={{alignSelf: 'baseline'}}
            />
          </>
        )}
      </View>
      <View style={[styles.lowerView, isMarker && {alignItems: 'center'}]}>
        {isMarker ? (
          <>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.belowBtn}
                onPress={() => setisMarker(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.belowBtn}
                onPress={() => setisMarker(false)}>
                <Text>OK</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.belowDescription}>
              <Text>lat: {currentpos.latitude.toFixed(5)}</Text>
              <Text>lng: {currentpos.longitude.toFixed(5)}</Text>
            </View>
          </>
        ) : (
          <CircularButton
            onPress={() => setisMarker(true)}
            icon={{name: 'map-marker-plus', type: 'material-community'}}
            style={{
              transform: [{scaleX: -1}],
            }}
          />
        )}
      </View>
    </View>
  );
}
