import LoginForm from './Components/LoginForm';
import MapPage from './Components/Map';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

function LoginScreen({ navigation }) {
  return (
    <LoginForm navigation={navigation}/>
  )
}

function MapScreen({ navigation }) {
  return (
    <MapPage navigation={ navigation }/>
  );
}
function SettingScreen({navigation}) {
  return (<View></View>);
}

const Drawer = createDrawerNavigator();

function UserProfileDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Map" component={MapScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <UserProfileDrawer />
    </NavigationContainer>
  );
}
