// import React from 'react';
// import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
// import { createAppContainer } from "react-navigation";
// import { createDrawerNavigator } from 'react-navigation-drawer';
// import { createStackNavigator } from "react-navigation-stack"
// import { Ionicons } from '@expo/vector-icons';
// import { Button } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { NavigationContainer } from '@react-navigation/native';
// import MapPage from './Map.js';

// const DrawerButton = ({ name, openDrawer }) => (
//     <Button
//       onPress={() => openDrawer()}
//       type='clear'
//       icon={ <Icon name='face-profile' size='30'/>}
//     />
// )

// const Home = ({ navigation }) => (
//     <View style={styles.header}>
//         <DrawerButton name="Home" openDrawer={navigation.openDrawer} />
//     </View>
// )

// const Profile = ({ navigation }) => (
//   <View style={styles.container}>
//     <DrawerButton name="Profile" openDrawer={navigation.openDrawer} />
//     {/* <Image source={require("./assets/banner.png")} style={{ width: "80%", height: "30%" }} resizeMode="contain" /> */}
//   </View>
// )

// const Settings = ({ navigation }) => (
//   <View style={styles.container}>
//     <DrawerButton name="Settings" openDrawer={navigation.openDrawer} />
//     <Text>SETTING PAGE!</Text>
//   </View>
// )

// function Item({ item, navigate }) {
//   return (
//     <TouchableOpacity style={styles.listItem} onPress={() => navigate(item.name)}>
//       <Ionicons name={item.icon} size={32} />
//       <Text style={styles.title}>{item.name}</Text>
//     </TouchableOpacity>
//   );
// }

// class Sidebar extends React.Component {
//   state = {
//     routes: [
//       {
//         name: "Home",
//         icon: "ios-home"
//       },
//       {
//         name: "Profile",
//         icon: "ios-contact"
//       },
//       {
//         name: "Settings",
//         icon: "ios-settings"
//       },
//     ]
//   }


//   render() {
//     return (
//       <View style={styles.container}>
//         {/* <Image source={require("./assets/profile.jpg")} style={styles.profileImg} /> */}
//         {/* <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>Janna Doe</Text>
//         <Text style={{ color: "gray", marginBottom: 10 }}>janna@doe.com</Text> */}
//         <View style={styles.sidebarDivider}></View>
//         <FlatList
//           style={{ width: "100%", marginLeft: 30 }}
//           data={this.state.routes}
//           renderItem={({ item }) => <Item item={item} navigate={this.props.navigation.navigate} />}
//           keyExtractor={item => item.name}
//         />
//       </View>
//     )
//   }
// }

// const Drawer = createDrawerNavigator(
//   {
//     Home: { screen: Home },
//     Profile: { screen: Profile },
//     Settings: { screen: Settings }

//   },
//   {
//     initialRouteName: "Home",
//     unmountInactiveRoutes: true,
//     headerMode: "none",
//     contentComponent: props => <Sidebar {...props} />
//   }
// )

// // const AppNavigator = createStackNavigator(
// //   {
// //     Drawer: { screen: Drawer },
// //   },
// //   {
// //     initialRouteName: "Drawer",
// //     headerMode: "none",
// //     unmountInactiveRoutes: true,
// //   }
// // )
// // const AppContainer = createAppContainer(AppNavigator);
// // export default class App extends React.Component {
// //     // static navigationOptions = {
// //     //     title: 'AppContainer',
// //     // }
// //     render() {
// //         return (
// //             <AppContainer />
        
// //         );
// //     }
// // }

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 40,
//     alignItems: "flex-start",
//     flex: 1
//   },
//   listItem: {
//     height: 60,
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   title: {
//     fontSize: 18,
//     marginLeft: 20
//   },
//   header: {
//     paddingTop: 40,
//     // flexDirection: "row",
//     justifyContent: "space-between",
//     // alignItems: "center",
//     paddingHorizontal: 20,
//     // backgroundColor: 'rgba(52, 52, 52, 0.8)'
//   },
//   profileImg: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginTop: 20
//   },
//   sidebarDivider: {
//     height: 1,
//     width: "100%",
//     backgroundColor: "lightgray",
//     marginVertical: 10
//   },
// });