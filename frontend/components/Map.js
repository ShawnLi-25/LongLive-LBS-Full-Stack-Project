import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import { Button } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions, TouchableHighlight, TextInput } from 'react-native';
import data from "../Data/test.json";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class MapPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            index: 0,
            pointList: this.generateData(),
            navigation: this.props.navigation,
            currentMarkerPressed: false,
        }
        this.createMarkerOnPress = this.createMarkerOnPress.bind(this);
        this.showDescriptionOnMarker = this.showDescriptionOnMarker.bind(this);
    }

    onRegionChange = (region) => {
        this.setState({ region })
    }

    createMarkerOnPress = (event) => {
        console.log("createMarkerOnPress");
        this.setState({
            markers: [
                ...this.state.markers,
                {
                    coordinate: event.nativeEvent.coordinate,
                    description: "hello",
                }
            ]
        })
    }

    showDescriptionOnMarker = (event, index) => {
        // let description = "selected marker";
        console.log(this.state.markers[index]);
        const { marker } = this.state.markers[index];
        this.setState({ currentMarkerPressed: !this.state.currentMarkerPressed });
        let latitude = event.nativeEvent.coordinate.latitude;
        let longitude = event.nativeEvent.coordinate.longitude;
        // request with latitude, latitude
    }

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
        const { navigation } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation
                    followsUserLocation={true}
                    showsMyLocationButton
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: 41.88825,
                        longitude: -87.6324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }} 
                    onRegionChange={this.onRegionChange}
                    onPress={(event) => { this.createMarkerOnPress(event) }}
                >
                    {this.state.markers.map((marker, index) => (
                        <Marker
                            draggable 
                            stopPropagation
                            calloutVisible
                            key={index}
                            onSelect={(event) => { this.showDescriptionOnMarker(event, index)}}
                            position={this.position}
                            // onDrag={(event) => this.setState({ x: event.nativeEvent.coordinate })}
                            {...marker}
                        >
                            <MapView.Callout tooltip={true}>
                                <Button 
                                    large
                                    raised
                                    title="Search Criminal Records"
                                    // onPress={this.props.navigation.navigate("Report")}
                                >
                                </Button>
                            </MapView.Callout>
                        </Marker>
                    ))}
                    <Heatmap 
                        points={this.state.pointList}
                        opacity={7}
                        radius={50}
                        maxIntensity={100}
                        heatmapMode={"POINTS_DENSITY"} >
                    </Heatmap>
                </MapView>
                <View style={styles.userProfileButtonContainer}>
                    <Button
                        onPress={() => { this.props.navigation.openDrawer() }}
                        type='clear'
                        icon={<Icon name='face-profile' size='60' />}
                    />
                </View>
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
    userProfileButtonContainer: {
        position: 'absolute', //use absolute position to show button on top of the map
        top: '0%',
        right: '0%',
        flex: 1,
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
