import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
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
import Clipboard from '@react-native-clipboard/clipboard';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import {onAuthStateChanged} from '../../services/firebase/authentication';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../redux/reducer';
import {SvgXml} from 'react-native-svg';
import {calebrateMarker} from '../../assets/svgs';
import {TextInput} from '../../components/index';

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
  const [showView, setShowView] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isPoligon, setIsPoligon] = useState<boolean>(false);
  const [polygonIndex, setpolygonIndex] = useState<number>(0);
  const [markerTitle, setMarkerTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('#3498db');
  const [phoneNumber, setPhoneNumber] = useState<string>('#3498db');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2024/01/16');
  const [selectedTime, setSelectedTime] = useState('17:08:59');
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
        Clipboard.setString(JSON.stringify(currentpos));
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

  const copyToClipboard = () => {
    Clipboard.setString(JSON.stringify(currentpos));
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onColorChange = (color: any) => {
    setSelectedColor(color);
  };

  const paletteColors = [
    '#3498db',
    '#e74c3c',
    '#2ecc71',
    '#f39c12',
    '#9b59b6',
    '#16a085',
    '#d35400',
    '#8e44ad',
    '#27ae60',
    '#c0392b',
    '#2980b9',
    '#f1c40f',
    '#34495e',
    '#e67e22',
    '#7f8c8d',
  ];

  const renderItem = ({item}) => (
    <Pressable
      onPress={() => onColorChange(item)}
      style={[
        styles.colorOption,
        {
          backgroundColor: item,
          borderColor: selectedColor === item ? 'white' : 'transparent',
        },
      ]}
    />
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = date => {
    const formattedDate = date?.toLocaleDateString('en-PK');
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  const handleConfirmTwo = time => {
    const formattedTime = time?.toLocaleTimeString('en-US', {hour12: false});
    setSelectedTime(formattedTime);
    hideTimePicker();
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
                    onPress={() => {
                      setisMarker(false);
                      setShowView(false);
                    }}>
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.belowBtn}
                    onPress={() => {
                      setisMarker(false);
                      setShowView(false);
                    }}>
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.belowBtn}
                    onPress={() => {
                      setMarkerCoord(currentpos);
                      setisMarker(false);
                      setShowView(true);
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
      {!isModalVisible && showView && (
        <View style={styles.showHideView}>
          <View style={styles.markerEighteen}>
            <Text style={styles.markerHeading}>Marker 18</Text>
            <Text style={styles.timeAndDate}>2024/01/15 @ 15:27:04</Text>
          </View>

          <View style={styles.iconsView}>
            <TouchableOpacity style={styles.box} onPress={toggleModal}>
              <Icon
                type="entypo"
                name="edit"
                size={scale(20)}
                color={theme.colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={copyToClipboard} style={styles.box}>
              <Icon
                type="material-community"
                name="content-copy"
                size={scale(20)}
                color={theme.colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.box}>
              <Icon
                type="font-awesome"
                name="location-arrow"
                size={scale(20)}
                color={theme.colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.box}>
              <Icon
                type="entypo"
                name="dots-three-vertical"
                size={scale(20)}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        backdropColor={'transparent'}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContentContainer}>
            <View style={styles.markerTitleView}>
              <Text style={styles.markerTitleHeading}>Title</Text>
              <TextInput
                placeholder="Marker 22"
                containerStyle={styles.textInputContainer}
                placeholderTextColor={theme.colors.offWhite}
                style={styles.textInput}
                onChangeText={setMarkerTitle}
                value={markerTitle}
              />

              <View style={styles.descriptionView}>
                <Text style={styles.markerTitleHeading}>Description</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={8}
                  containerStyle={styles.descriptionTextInput}
                  placeholderTextColor={theme.colors.offWhite}
                  style={styles.textInput}
                  onChangeText={setDescription}
                  value={description}
                />
              </View>
            </View>

            <View style={styles.colorContainer}>
              <Text style={styles.markerTitleHeading}>Icon and color</Text>
              <View style={styles.iconAndColorView}>
                <View style={styles.staticBox}>
                  <Icon
                    type="ionicon"
                    name="location-outline"
                    size={scale(20)}
                    color={theme.colors.white}
                  />
                </View>
                <View style={styles.colorBoxContainer}>
                  <FlatList
                    data={paletteColors}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContainer}
                  />
                </View>
              </View>
            </View>

            <View style={styles.phoneNumberView}>
              <Text style={styles.markerTitleHeading}>Phone Number</Text>
              <TextInput
                containerStyle={styles.phoneNumberContainer}
                placeholderTextColor={theme.colors.offWhite}
                style={styles.textInput}
                onChangeText={setPhoneNumber}
                value={phoneNumber}
              />
              <View style={styles.iconSelectionView}>
                <TouchableOpacity style={styles.selectIcon}>
                  <Icon
                    type="font-awesome"
                    name="phone"
                    size={scale(20)}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectIcon}>
                  <Icon
                    type="material"
                    name="dialpad"
                    size={scale(20)}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectIcon}>
                  <Icon
                    type="material-community"
                    name="message-processing-outline"
                    size={scale(20)}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectIcon}>
                  <Icon
                    type="material-community"
                    name="content-copy"
                    size={scale(20)}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.plusImagesView}>
              <Text style={styles.markerTitleHeading}>Images</Text>
              <TouchableOpacity style={styles.selectIcon}>
                <Icon
                  type="entypo"
                  name="plus"
                  size={scale(20)}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.gpsView}>
              <Text style={styles.GPScoordinates}>GPS coordinates</Text>
              <View>
                <Text style={styles.latLngText}>
                  Latitude: {myPosition?.latitude?.toFixed(5)}
                </Text>
                <Text style={styles.latLngText}>
                  Longitude: {myPosition?.longitude?.toFixed(5)}
                </Text>
                <View style={styles.gpsViewinRow}>
                  <TouchableOpacity style={styles.gpsViewinRowIcon}>
                    <Icon
                      type="material-community"
                      name="content-copy"
                      size={scale(20)}
                      color={theme.colors.white}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.gpsViewinRowIcon}>
                    <Icon
                      type="entypo"
                      name="edit"
                      size={scale(20)}
                      color={theme.colors.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.creationDateView}>
              <Text style={styles.GPScoordinates}>Creation date</Text>
              <View style={styles.creationDateViewinRow}>
                <TouchableOpacity
                  style={styles.dateTimePicker}
                  onPress={showDatePicker}>
                  <Icon
                    type="material-community"
                    name="calendar-outline"
                    size={scale(20)}
                    color={'white'}
                  />
                  <Text style={styles.latLngText}>{selectedDate}</Text>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    is24Hour={false}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dateTimePicker}
                  onPress={showTimePicker}>
                  <Icon
                    type="feather"
                    name="clock"
                    size={scale(20)}
                    color={'white'}
                  />
                  <Text style={styles.latLngText}>{selectedTime}</Text>
                  <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    is24Hour={false}
                    onConfirm={handleConfirmTwo}
                    onCancel={hideTimePicker}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.extraInformation}>
              <Text style={styles.GPScoordinates}>Extra information</Text>
              <Text style={styles.latLngText}>
                Unnamed Road, Sharqpur, Pakistan
              </Text>

              <TouchableOpacity style={styles.insertView}>
                <Icon
                  type="material-community"
                  name="clipboard-outline"
                  size={scale(20)}
                  color={'white'}
                />
                <Text style={styles.latLngText}>Insert...</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </Modal>

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
          //onTouchStart={e => console.log('e2:', e.nativeEvent)}
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
