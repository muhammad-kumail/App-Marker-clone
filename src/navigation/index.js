import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../screens/Home';
import {CustomDrawer} from '../components';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import {useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
export default function Navigation() {
  const token = useSelector(state => state.token);
  console.log('🚀 ~ file: index.js:14 ~ Navigation ~ token:', token);
  return (
    <NavigationContainer theme={DarkTheme}>
      {token ? <MainNavigation /> : <AuthNavigation />}
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
function AuthNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}
