import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../globalStyles';
import theme, {scale} from '../../theme';
import {Icon} from 'react-native-elements';
import {CircularButton, MainIcon, Text} from '../../components';
import {styles} from './styles';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function Home({navigation}: any) {
  const [currentpos, setCurrentPos] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [watchId, setWatchId] = useState<number>(0);
  const [isDrawer, setIsDrawer] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    Geolocation.getCurrentPosition(pos => {
      const {latitude, longitude} = pos.coords;

      setCurrentPos({
        latitude,
        longitude,
      });
    });
    const wId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentPos({latitude, longitude});
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, distanceFilter: 10},
    );
    setWatchId(wId);
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);
  return (
    <View style={[globalStyles.container]}>
      <MapView
        onRegionChange={e => console.log('region change:', e)}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
        initialRegion={{
          latitude: currentpos.latitude,
          longitude: currentpos.longitude,
          latitudeDelta: 2 * Math.abs(currentpos.latitude),
          longitudeDelta: 2 * Math.abs(currentpos.longitude),
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}>
        <Marker
          // draggable
          title={'Test location'}
          description={'Test location description'}
          style={{height: 40, width: 40}}
          pinColor={'lime'}
          coordinate={currentpos}
          // onDragEnd={e =>
          //   console.log('marker drag end:', e.nativeEvent.coordinate)
          // }
        />
      </MapView>
      <View>
        <View style={styles.topView}>
          <View style={styles.topInnerView}>
            <MainIcon
              name="bars"
              type="font-awesome"
              style={{
                borderRightWidth: 1,
                borderColor: 'gray',
                borderTopLeftRadius: scale(6),
                borderBottomLeftRadius: scale(6),
              }}
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
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: scale(10),
          }}>
          <CircularButton
            icon={{name: 'map-marker-circle', type: 'material-community'}}
            style={{
              padding: scale(12),
              transform: [{rotate: '180deg'}],
            }}
          />
          <CircularButton icon={{name: 'my-location', type: 'material'}} />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          width: '100%',
          paddingHorizontal: scale(10),
          gap: scale(10),
        }}>
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
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: scale(10),
          paddingBottom: scale(10),
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>
        <CircularButton
          icon={{name: 'map-marker-plus', type: 'material-community'}}
          style={{
            transform: [{scaleX: -1}],
          }}
        />
      </View>
    </View>
  );
}
