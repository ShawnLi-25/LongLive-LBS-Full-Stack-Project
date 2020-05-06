import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import LoginForm from './components/LoginForm';
import MapPage from './components/Map';
import UserSetting from './components/UserSetting';
import ReportForm from './components/ReportForm';
import UpdateForm from './components/UpdateForm';
import DeleteForm from './components/DeleteForm';
import SearchView from './components/SearchView';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
console.disableYellowBox = true;
function LoginScreen({ navigation }) {
  return (
    <LoginForm navigation={navigation} />
  )
}

function MapScreen({ navigation }) {
  return (
    <MapPage navigation={ navigation }/>
  );
}

function SettingScreen({navigation}) {
  return (
    <UserSetting navigation={navigation}/>
  );
}

function HelpScreen({ navigation }) {
  return (<View style={styles.userProfileButtonContainer}>
    <Button style={styles.goBackButtonStyle} onPress={() => {navigation.goBack()}}></Button>
  </View>);
}

function ReportScreen({ navigation }) {
  return <ReportForm navigation={navigation}/>
}
function UpdateScreen({ navigation }) {
  return <UpdateForm navigation={navigation}/>
}
function DeleteScreen({ navigation }) {
  return <DeleteForm navigation={navigation}/>
}
function SearchScreen({ navigation }) {
  return <SearchView navigation={navigation} />
}
const Drawer = createDrawerNavigator();

function UserProfileDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Map" component={MapScreen} />
      <Drawer.Screen name="Report" component={ReportScreen}/>
      <Drawer.Screen name="Update" component={UpdateScreen} />
      <Drawer.Screen name="Delete" component={DeleteScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} />
      <Drawer.Screen name="List" component={SearchScreen} />
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

const styles = StyleSheet.create({
  userProfileButtonContainer: {
    backgroundColor: 'black',
    // position: 'absolute', //use absolute position to show button on top of the map
    // top: '100%',
    // right: '0%',
    flex: 1,
  },
  goBackButtonStyle: {
    paddingTop: 500,
    position: 'absolute',
    right: '20%',
  }
});