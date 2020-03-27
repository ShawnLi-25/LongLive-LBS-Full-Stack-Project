import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import { Header, Button, Icon } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions, TouchableHighlight } from 'react-native';

export default class MapPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 41.88825,
                longitude: -87.6324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            markers: [],
            index: 0,
        }
        this.createMarkerOnPress = this.createMarkerOnPress.bind(this);
    }
    static navigationOptions = {
        title: 'MapPage',
    }
    
    onRegionChange = (region) => {
        this.setState({ region })
    }

    createMarkerOnPress = (pressedPosition) => {
        this.setState({
            markers: [
                ...this.state.markers,
                {
                    coordinate: pressedPosition.nativeEvent.coordinate,
                }
            ]
        })
    }
    onMarkerDragEnd = (coord, index) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        alert("drug!");
        this.setState(prevState => {
            const markers = [...this.state.markers];
            markers[index] = { ...markers[index], position: { lat, lng } };
            return { markers };
        });
    };
    render() {
        let points = [{ latitude: 41.88825, longitude: -87.6324, weight: 1 },
                      { latitude: 42.88825, longitude: -87.6324, weight: 1 },
                      { latitude: 43.88825, longitude: -87.6324, weight: 1 },
                      { latitude: 44.88825, longitude: -87.6324, weight: 1 },
                      { latitude: 45.88825, longitude: -87.6324, weight: 1 },
                      { latitude: 6.830766, longitude: 79.861319, weight: 1 },
                      { latitude: 6.827766, longitude: 79.861319, weight: 1 },
                      { latitude: 6.82076681, longitude: 79.871319, weight: 1 },
                      { latitude: 6.82076681, longitude: 79.861319, weight: 1 },
                      { latitude: 6.81076681, longitude: 79.861319, weight: 1 },
                      { latitude: 6.83776681, longitude: 79.869319, weight: 1 },
                      { latitude: 6.83276681, longitude: 79.869319, weight: 1 },]
        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation
                    showsMyLocationButton
                    style={styles.mapStyle}
                    initialRegion={{
                        latitude: 41.88825,
                        longitude: -87.6324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }} 
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}
                    onPress={this.createMarkerOnPress}
                    >
                    {this.state.markers.map((marker, index) => (
                        <Marker
                            draggable 
                            position={this.position}
                            onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
                        {...marker}/>
                    ))}
                    <Heatmap 
                        points={points}
                        opacity={1}
                        radius={200}
                        maxIntensity={100}
                        gradientSmoothing={10}
                        heatmapMode={"POINTS_DENSITY"}>
                    </Heatmap>
                </MapView>
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
        height: Dimensions.get('window').height
    },
    alert_button: {
        color: 'red'
    },
    userProfileButton: {
        flex: 0,
        color: 'pink',
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
    },
});
