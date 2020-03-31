// import React from 'react';
// import { View, Text, Icon, AppRegistry } from 'react-native';
// import 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import MapPage from './Components/Map.js';
// import LoginForm from './Components/LoginForm.js';
// import MenuIcon from "./Components/MenuIcon.js";
// import { useNavigation } from '@react-navigation/native';
// // import SideMenu from 'react-native-side-menu';

// // function Login(props) {
// //   const navigation = useNavigation();
// //   return <Login {...props} navigation={navigation} />;
// // }

// const Stack = createStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={LoginForm} />
//         <Stack.Screen name="MapPage" component={MapPage} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
// export default App;
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './Components/LoginForm';
import MapPage from './Components/Map';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

function LoginScreen({ navigation }) {
  return (
    <LoginForm navigation={navigation}>
    </LoginForm>
  )
}

function MapScreen({ navigation }) {
  return (
    <MapPage navigation={navigation}>
    </MapPage>
  )
}
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        {/* <Stack.Screen name="Menu" component={Menu}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
