import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import theme, {scale} from '../../theme';
import {Icon} from 'react-native-elements';
import CustomText from '../CustomText';
import {DrawerItem} from '..';

export default function CustomDrawer({navigation}: any) {
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [isFolder1, setIsFolder1] = useState<boolean>(false);
  const [isFolder2, setIsFolder2] = useState<boolean>(false);
  return (
    <ScrollView style={styles.container}>
      <DrawerItem
        icon={
          <Icon
            name="alert-octagon"
            type="material-community"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        style={{
          borderBottomWidth: 0,
        }}
        title="Data backup"
        description="last backup 4 days ago"
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
      <DrawerItem
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
      />
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
        title="Default folders"
        description="6 markers"
        onPress={() => setIsFolder1(!isFolder1)}
        isSelected={isFolder1}
      />
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
        title="My first folder"
        description="1 markers"
        onPress={() => setIsFolder2(!isFolder2)}
        isSelected={isFolder2}
      />
      <DrawerItem
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
      />
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
