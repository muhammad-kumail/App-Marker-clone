import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {globalStyles} from '../../globalStyles';
import theme, {scale} from '../../theme';
import {Icon} from 'react-native-elements';
import {CircularButton, MainIcon, Text} from '../../components';
import {styles} from './styles';
import MapView, {
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Polygon,
  Region,
} from 'react-native-maps';
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
  // console.log('🚀 ~ file: index.tsx:18 ~ Home ~ token:', token);
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);
  const mapRef = useRef<MapView>(null);
  const {width, height} = Dimensions.get('window');
  const [mapHead, setMapHead] = useState<number>(0);

  const [isMarker, setisMarker] = useState<boolean>(false);
  const [markerCoord, setMarkerCoord] = useState<LatLng>();
  const [isPoligon, setIsPoligon] = useState<boolean>(false);
  const [polygonIndex, setpolygonIndex] = useState<number>(0);
  // console.log(
  //   '🚀 ~ Home ~ mapRef.current:',
  //   mapRef.current?.getCamera().then(res => console.log('res:', res)),
  // );

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
  const [polygonCoordinates, setPolygonCoordinates] = useState<LatLng[]>([]);
  const [watchId, setWatchId] = useState<number>(0);

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

  const updatePolygonCoordinate = (coord: Region, isEdit: boolean = false) => {
    let polygon = [...polygonCoordinates];
    polygon.splice(polygonIndex, isEdit ? 1 : 0, {
      latitude: coord.latitude,
      longitude: coord.longitude,
    });
    setPolygonCoordinates(polygon);
    // isEdit &&
    //   mapRef.current?.animateToRegion(
    //     {
    //       latitude: coord.latitude,
    //       longitude: coord.longitude,
    //       latitudeDelta: currentpos.latitudeDelta,
    //       longitudeDelta: currentpos.longitudeDelta,
    //     },
    //     0,
    //   );
    !isEdit && setpolygonIndex(polygonIndex + 1);
  };
  const removePolygonCoordinate = () => {
    let polygon = [...polygonCoordinates];
    if (polygonCoordinates.length > 1) {
      polygon.splice(polygonIndex, 1);
      polygonIndex > 0
        ? changePolygonIndex('dec')
        : setpolygonIndex(polygonCoordinates.length - 1);
    }

    setPolygonCoordinates(polygon);
  };
  const changePolygonIndex = (isAdd: string = 'inc') => {
    if (isAdd === 'inc') {
      let newIndex = (polygonIndex + 1) % polygonCoordinates.length;
      setpolygonIndex(newIndex);
      mapRef.current?.animateToRegion(
        {
          latitude: polygonCoordinates[newIndex].latitude,
          longitude: polygonCoordinates[newIndex].longitude,
          latitudeDelta: currentpos.latitudeDelta,
          longitudeDelta: currentpos.longitudeDelta,
        },
        0,
      );
    } else if (isAdd === 'dec') {
      let newIndex =
        polygonIndex !== 0 ? polygonIndex - 1 : polygonCoordinates.length - 1;
      setpolygonIndex(newIndex);
      mapRef.current?.animateToRegion(
        {
          latitude: polygonCoordinates[newIndex].latitude,
          longitude: polygonCoordinates[newIndex].longitude,
          latitudeDelta: currentpos.latitudeDelta,
          longitudeDelta: currentpos.longitudeDelta,
        },
        0,
      );
    }
  };
  return (
    <View style={[globalStyles.container]}>
      {isMarker && !isPoligon && (
        <SvgXml
          style={styles.centeredElement}
          xml={calebrateMarker}
          height={scale(100)}
          width={scale(100)}
        />
      )}
      <View style={{zIndex: 1}}>
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
            onPress={() => {
              mapRef.current?.animateCamera(
                {center: currentpos, pitch: 0, heading: 0},
                {duration: 600},
              );
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
              mapRef.current?.animateToRegion(
                {
                  latitude: myPosition.latitude,
                  longitude: myPosition.longitude,
                  latitudeDelta: currentpos.latitudeDelta,
                  longitudeDelta: currentpos.longitudeDelta,
                },
                600,
              );
            }}
          />
        </View>
      </View>
      <View style={styles.centerView}>
        {isMarker && (
          <>
            <CircularButton
              icon={{name: 'analytics-outline', type: 'ionicon'}}
              style={{
                display: !isPoligon ? 'flex' : 'none',
                alignSelf: 'baseline',
              }}
            />
            <CircularButton
              icon={{
                name: isPoligon ? 'close' : 'vector-polygon',
                type: isPoligon ? 'AntDesign' : 'material-community',
              }}
              style={{alignSelf: 'baseline'}}
              onPress={() => {
                setIsPoligon(!isPoligon);
                if (!isPoligon) {
                  setPolygonCoordinates([
                    {
                      latitude: currentpos.latitude,
                      longitude: currentpos.longitude,
                    },
                  ]);
                } else {
                  setPolygonCoordinates([]);
                  setpolygonIndex(0);
                }
              }}
            />
            <CircularButton
              icon={{name: 'vector-circle-variant', type: 'material-community'}}
              style={{
                display: !isPoligon ? 'flex' : 'none',
                alignSelf: 'baseline',
              }}
            />
          </>
        )}
      </View>
      <View style={[styles.lowerView, isMarker && {alignItems: 'center'}]}>
        {isMarker ? (
          <>
            <View style={{flexDirection: 'row'}}>
              {!isPoligon ? (
                <>
                  <TouchableOpacity
                    style={styles.belowBtn}
                    onPress={() => setisMarker(false)}>
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.belowBtn}
                    onPress={() => {
                      setMarkerCoord(currentpos);
                      setisMarker(false);
                    }}>
                    <Text>OK</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View
                  style={[
                    styles.belowDescription,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: scale(10),
                      paddingVertical: scale(12),
                    },
                  ]}>
                  <Icon
                    type="entypo"
                    name="chevron-left"
                    size={scale(20)}
                    color={
                      polygonCoordinates.length > 1
                        ? theme.colors.white
                        : theme.colors.gray
                    }
                    onPress={() => changePolygonIndex('dec')}
                  />
                  <Icon
                    type="entypo"
                    name="plus"
                    size={scale(20)}
                    color={theme.colors.white}
                    onPress={() => {
                      updatePolygonCoordinate(currentpos, false);
                    }}
                  />
                  <Icon
                    type="entypo"
                    name="minus"
                    size={scale(20)}
                    color={
                      polygonCoordinates.length > 1
                        ? theme.colors.white
                        : theme.colors.gray
                    }
                    onPress={removePolygonCoordinate}
                  />
                  <Icon
                    type="entypo"
                    name="chevron-right"
                    size={scale(20)}
                    color={
                      polygonCoordinates.length > 1
                        ? theme.colors.white
                        : theme.colors.gray
                    }
                    onPress={() => changePolygonIndex('inc')}
                  />
                  <Icon
                    type="entypo"
                    name="save"
                    size={scale(20)}
                    color={theme.colors.white}
                  />
                </View>
              )}
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
      {myPosition.latitude !== 0 && myPosition.longitude !== 0 && (
        <MapView
          onPress={e => console.log('e:', e.nativeEvent.coordinate)}
          ref={mapRef}
          // provider={PROVIDER_GOOGLE}
          onRegionChange={e => {
            // console.log('region change:', e);
            setCurrentPos(item => e);
            updatePolygonCoordinate(e, true);
          }}
          onRegionChangeComplete={e =>
            console.log('region change complete:', e)
          }
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            // zIndex: 1,
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
          onTouchStart={e => console.log('e2:', e.nativeEvent)}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}>
          {markerCoord && (
            <Marker
              style={{display: markerCoord ? 'flex' : 'none'}}
              coordinate={markerCoord}
              pinColor="red"
            />
          )}
          {isMarker && isPoligon && (
            <>
              <Polygon
                coordinates={polygonCoordinates}
                fillColor="rgba(0, 200, 0, 0.5)"
                strokeWidth={2}
              />
              {polygonCoordinates.map((item, index) => {
                return (
                  <Marker
                    key={index}
                    // style={{height: scale(15), width: scale(15)}}
                    coordinate={{
                      latitude: parseFloat(item.latitude.toFixed(4)),
                      longitude: parseFloat(item.longitude.toFixed(4)),
                    }}>
                    <Image
                      source={
                        index === polygonIndex
                          ? require('../../assets/images/markerSelected.png')
                          : require('../../assets/images/markerUnselected.jpg')
                      }
                      style={[
                        {height: scale(15), width: scale(15)},
                        index === polygonIndex && {zIndex: 1},
                      ]}
                    />
                  </Marker>
                );
              })}
            </>
          )}
        </MapView>
      )}
    </View>
  );
}
