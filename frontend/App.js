import React from 'react';
import MapView from 'react-native-maps';
import { Header, Button } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

export default class App extends React.Component {
  render() {
    return (  
      <View style={styles.container}>
        <Header 
          containerStyle={{height: 100}}
          backgroundColor={'black'}
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
          />
        <View style={styles.buttonContainer}>
          <Button
            style={styles.alert_button}
            onPress={() => {alert("warning!");}}
            title="Press Me"
          />
        </View>
        <MapView 
          style={styles.mapStyle}
          initialRegion={{
            latitude: 41.88825,
            longitude: -87.6324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    flex: 0,
    width: Dimensions.get('window').width,
    height: 500
    // height: Dimensions.get('window').height,
  },
  header: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 100,
  },
  alert_button: {
    color: 'red'
  }
});
