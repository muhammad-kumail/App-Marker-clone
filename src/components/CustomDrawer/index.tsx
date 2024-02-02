import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import theme, {scale} from '../../theme';
import {Icon} from 'react-native-elements';
import CustomText from '../CustomText';
import {DrawerItem} from '..';
import {useDispatch, useSelector} from 'react-redux';
import {signOut} from '../../services/firebase/authentication';
import {setToken} from '../../redux/reducer';
import {getAllMarkersTitles} from '../../services/firebase/firestore/index';
import { setMarkerNames } from '../../redux/extraReducer';

export default function CustomDrawer({navigation}: any) {
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [isFolder1, setIsFolder1] = useState<boolean>(false);
  const [isFolder2, setIsFolder2] = useState<boolean>(false);
  const markerRef = useRef(0);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const markerLen = useSelector((state: any) => state?.map?.markersLength);
  console.log("🚀 ~ CustomDrawer ~ markerLen:", markerLen);

  useEffect(() => {
    getAllMarkersTitles()
      .then(titles => {
         markerRef.current = titles?.length;
         dispatch(setMarkerNames(titles));
        //console.log('Markers titles:', titles);
      })
      .catch(error => {
        console.error('Error:', error?.message);
      });
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <DrawerItem
        icon={
          <Icon
            name="person-circle"
            type="ionicon"
            size={scale(50)}
            color={theme.colors.white}
          />
        }
        style={{
          borderBottomWidth: 0,
        }}
        contentViewStyle={{flex: 3}}
        title={user?.displayName}
        description={user?.email}
        onPress={() => console.log('first')}
      />
      <View style={styles.titleView}>
        <CustomText style={{fontSize: theme.fontSizes.medium}}>Map</CustomText>
      </View>
      <DrawerItem
        icon={
          <Icon
            name="sd-card"
            type="material"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        title="2023/12/19 @ 11:33:32"
        onPress={() => console.log('second')}
      />
      <DrawerItem
        icon={
          <Icon
            name="map-sharp"
            type="ionicon"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        style={{
          borderBottomWidth: 0,
        }}
        title="Map type"
        description="Google Maps (Plan)"
        onPress={() => console.log('third')}
      />
      <View style={styles.titleView}>
        <CustomText style={{fontSize: theme.fontSizes.medium}}>
          Folders
        </CustomText>
      </View>
      {/* <DrawerItem
        icon={
          <Icon
            name="select-all"
            type="material"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        style={{borderBottomWidth: 0}}
        title="All"
        description="7 markers in 2 folders"
        onPress={() => {
          setIsSelect(!isSelect);
          setIsFolder1(!isSelect);
          setIsFolder2(!isSelect);
        }}
        isSelected={isSelect}
      /> */}
      <DrawerItem
        icon={
          <Icon
            name="folder-marker"
            type="material-community"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        style={{borderBottomWidth: 0}}
        title="Markers"
        description={`${markerRef.current} markers`}
        onPress={() => setIsFolder1(!isFolder1)}
        isSelected={isFolder1}
      />
      {/* <DrawerItem
        icon={
          <Icon
            name="folder-marker"
            type="material-community"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        style={{borderBottomWidth: 0}}
        title="My first folder"
        description="1 markers"
        onPress={() => setIsFolder2(!isFolder2)}
        isSelected={isFolder2}
      /> */}
      {/* <DrawerItem
        icon={
          <Icon
            name="folder-add"
            type="foundation"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 0,
        }}
        title="Add folder"
        onPress={() => console.log('third')}
      /> */}

      <View style={styles.titleView}>
        <CustomText style={{fontSize: theme.fontSizes.medium}}>
          Help & Feedback
        </CustomText>
      </View>
      <DrawerItem
        icon={
          <Icon
            name="settings"
            type="material"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        title="Settings"
        onPress={() => console.log('first')}
      />
      <DrawerItem
        icon={
          <Icon
            name="information-outline"
            type="material-community"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        title="About"
        description="Map Marker 3.6.0_633"
        onPress={() => console.log('first')}
      />
      <DrawerItem
        icon={
          <Icon
            name="fire"
            type="material-community"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        title="Premium"
        onPress={() => console.log('first')}
      />
      <DrawerItem
        icon={
          <Icon
            name="logout"
            type="material-community"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        title="Logout"
        onPress={() => {
          signOut()
            .then(res => {
              console.log('🚀 ~ file: index.tsx:190 ~ signOut ~ res:', res);
            })
            .catch(err => {
              console.log('🚀 ~ file: index.tsx:192 ~ signOut ~ err:', err);
            });
          dispatch(setToken(null));
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.darkGray,
  },
  titleView: {
    backgroundColor: theme.colors.lightGray,
    padding: scale(8),
    paddingHorizontal: scale(15),
    justifyContent: 'center',
  },
});
