import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import { Button } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions, TouchableHighlight } from 'react-native';
import data from "../Data/test.json";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
            pointList: this.generateData(),
            navigation: this.props.navigation,
        }
        this.createMarkerOnPress = this.createMarkerOnPress.bind(this);
    }

    onRegionChange = (region) => {
        this.setState({ region })
    }

    componentWillMount = () => {
        this.setState({ navigation: this.props.navigation })
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
        this.setState(prevState => {
            const markers = [...this.state.markers];
            markers[index] = { ...markers[index], position: { lat, lng } };
            return { markers };
        });
    };

    generateData = () => {
        let points = [];
        for (var i = 0; i < data.data.length; i++) {
            var point = {
                latitude: Number(data.data[i][0]), 
                longitude: Number(data.data[i][1]), 
                weight: Number(4)
            };
            points.push(point);
        }
        try {
            this.setState({ pointList: points }, function() {
                console.log("after set state");
            });
        } catch (err) {
            alert("err");
        }
        return points;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation
                    showsMyLocationButton
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: 41.88825,
                        longitude: -87.6324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }} 
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}
                    onPress={this.createMarkerOnPress}
                    onPress={(event) => console.log(event.nativeEvent.coordinate)}
                    >
                    {this.state.markers.map((marker, index) => (
                        <Marker
                            draggable 
                            position={this.position}
                            onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
                        {...marker}/>
                    ))}
                    <Heatmap 
                        points={this.state.pointList}
                        opacity={7}
                        radius={50}
                        maxIntensity={100}
                        heatmapMode={"POINTS_DENSITY"}
                    >
                    </Heatmap>
                </MapView>
                <View style={{
                    position: 'absolute', //use absolute position to show button on top of the map
                    top: '0%', 
                    right: '0%',
                    flex: 1,
                }}><Button
                        onPress={() => { this.props.navigation.openDrawer() }}
                        type='clear'
                        icon={<Icon name='face-profile' size='60' />}
                    /></View>
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
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36
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
