import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../screens/Home';
import {CustomDrawer} from '../components';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
export default function Navigation() {
  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
}
function MainNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false, drawerType: 'slide'}}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
}
