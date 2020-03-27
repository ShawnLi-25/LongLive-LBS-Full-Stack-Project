import React from 'react';
import MapView from 'react-native-maps';
import { Header, Button, Icon } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions, TouchableHighlight } from 'react-native';
import WebView from 'react-native-webview';

export default class MapPage extends React.Component {
    state = { myWebView: false }
    render() {
        return (
            <View style={styles.container}>
                <Header
                    containerStyle={{ height: 100 }}
                    backgroundColor={'black'}
                    // leftComponent={{ icon: 'menu', color: '#fff' }}
                    leftComponent={
                        <TouchableHighlight>
                            <Icon
                                // raised
                                name='home'
                                type='font-awesome'
                                color='#f50'
                                onPress={() => { alert("Show User Profile"); }} />
                        </TouchableHighlight>
                    }
                    centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                    rightComponent={
                        <TouchableHighlight>
                            <Icon
                                // raised
                                name='heart'
                                type='font-awesome'
                                color='#f50'
                                onPress={() => { this.setState({ myWebView: true }) }} />
                        </TouchableHighlight>
                    }>
                </Header>
                <MapView
                    style={styles.mapStyle}
                    initialRegion={{
                        latitude: 41.88825,
                        longitude: -87.6324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }} />
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
    },
    userProfileButton: {
        flex: 0,
        color: 'pink',
    }
});
