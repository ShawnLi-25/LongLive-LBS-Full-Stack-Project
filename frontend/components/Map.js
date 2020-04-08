import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import { Button, Image } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions, TouchableHighlight, TextInput } from 'react-native';
import data from '../Data/test.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SERVER from '../config';
import TypeIcon from './TypeIcon';
let typeCount = SERVER.typeCount;

function Circle({ onLayout, ...props }) {
    const ref = React.useRef();
    function onLayoutCircle() {
        if (ref.current) {
            ref.current.setNativeProps({ fillColor: props.fillColor });
            ref.current.setNativeProps({ strokeColor: props.strokeColor});
        }
    }
    return <MapView.Circle ref={ref} onLayout={onLayoutCircle} {...props} />;
}

export default class MapPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            index: 0,
            pointList: [],
            navigation: this.props.navigation,
            currentMarkerPressed: false,
            numHomicide: 0,
            crimeTypeCount: typeCount,
            currentRegion: {
                latitude: 41.88825,
                longitude: -87.6324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            zoom: 1,
            typeButtonPressed: false,
        } 
        this.createMarkerOnPress = this.createMarkerOnPress.bind(this);
    }
    updateTypeButtonPressed = () => {
        console.log('typeButtonPressed ' + this.state.typeButtonPressed);
        this.setState({ typeButtonPressed: !this.state.typeButtonPressed });
    }

    onRegionChange = (region) => {
        this.setState({ currentRegion: region })
        let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
        console.log("zoom: " + zoom);
        this.setState({zoom: zoom});
        const currentRegion = this.state.currentRegion;
        let requestType = `${SERVER.ROOT}getNearbyEvents/type?latitude=${currentRegion.latitude}&longitude=${currentRegion.longitude}&latDelta=${currentRegion.latitudeDelta}&lngDelta=${currentRegion.longitudeDelta}`;
        fetch(requestType)
        .then((response) => { return response.json(); })
        .then((typeCountData) => {
            let fetchedCrimeTypeCount = typeCount;
            for (var i = 0; i < typeCountData.length; i++) {
                let type = typeCountData[i]['Type'];
                let count = typeCountData[i]['Num'];
                fetchedCrimeTypeCount[type] = count
            }
            this.setState({ crimeTypeCount: fetchedCrimeTypeCount })
        });
        let requestPoints = `${SERVER.ROOT}getNearbyEvents/heatmap?latitude=${currentRegion.latitude}&longitude=${currentRegion.longitude}&latDelta=${currentRegion.latitudeDelta}&lngDelta=${currentRegion.longitudeDelta}`;
        if (!this.state.typeButtonPressed) {
            fetch(requestPoints)
                .then((response) => { return response.json(); })
                .then((locationData) => {
                    console.log("data count: " +locationData.length);
                    let testpoint = {
                            latitude: Number(currentRegion.latitude),
                            longitude: Number(currentRegion.longitude),
                    };
                    let fetchPointList = [];
                    // console.log("locationdata " + locationData);
                    for (var i = 0; i < locationData.length; i++) {
                        let point = {
                            latitude: (Number(locationData[i].latitude)),
                            longitude: Number(locationData[i].longitude),
                        };
                        // console.log("fetched point " + point.latitude + " " + point.longitude);
                        // console.log("current point " + testpoint.latitude + " " + testpoint.longitude);
                        fetchPointList.push(point);
                    }
                    // console.log(fetchPointList);
                    this.setState({ pointList: fetchPointList});
                    // // this.setState({ testpoint})
                    // console.log("test" + testpoint);
                    // console.log("pointList " + this.state.pointList)
                });
        }
    }
    
    createMarkerOnPress = (event) => {
        this.setState({
            markers: [
                ...this.state.markers,
                {
                    coordinate: event.nativeEvent.coordinate,
                }
            ]
        })
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

    searchCrimeType = (crimeType) => {
        const currentRegion = this.state.currentRegion;
        let requestString = `${SERVER.ROOT}getNearbyEvents/type?latitude=${currentRegion.latitude}&longitude=${currentRegion.longitude}&latDelta=${currentRegion.latitudeDelta}&lngDelta=${currentRegion.longitudeDelta}`;
        fetch(requestString).then((response) => { return response.json(); })
        .then((data) => {
            console.log(data);
        }) ;
    }

    onRegionChangeComplete = (region) => {
        let latiDelta = region.latitudeDelta;
        let longiDelta = region.longitudeDelta;
        this.setState({ currentRegion: { latitudeDelta: latiDelta }})
        this.setState({ currentRegion: { longitudeDelta: longiDelta }})
    }
    
    render() {
        let crimeTypeCount = this.state.crimeTypeCount;
        // let points = this.state.pointList;
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
                    // onRegionChangeComplete={this.onRegionChangeComplete}
                // onPress={(event) => { this.createMarkerOnPress(event) }}
                >
                    {this.state.pointList.map((circle, index) => (
                        <Circle
                            key={index}
                            center={circle}
                            radius={30}
                            fillColor='#FD7659'
                            strokeColor='transparent'
                            {...circle}/>
                    ))}
                </MapView>
                <View style={styles.userProfileButtonContainer}>
                    <Button
                        onPress={() => { this.props.navigation.openDrawer() }}
                        type='clear'
                        icon={<Icon name='face-profile' size={60} />}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            buttonStyle={{ backgroundColor: 'white' }}
                            type='clear'
                            icon={<TypeIcon name='knife' size={30} action={this.updateTypeButtonPressed}/>}
                            onPress={() => this.searchCrimeType('HOMICIDE')}
                        />
                        <Text style={{ fontSize: 8 }}>HOMICIDE</Text>
                        <Text style={{ fontSize: 8 }}>{crimeTypeCount['HOMICIDE'] ? crimeTypeCount['HOMICIDE'] : 0}</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<TypeIcon name='drupal' size={30} action={this.updateTypeButtonPressed}/>}
                            onPress={() => this.searchCrimeType('THEFT')}
                        />
                        <Text style={{ fontSize: 8 }}>THEFT</Text>
                        <Text style={{ fontSize: 8 }}>
                            {crimeTypeCount['MOTOR VEHICLE THEFT'] + crimeTypeCount['THEFT'] ? crimeTypeCount['MOTOR VEHICLE THEFT'] + crimeTypeCount['THEFT'] : 0}
                        </Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<TypeIcon name='kabaddi' size={30} action={this.updateTypeButtonPressed}/>}
                            onPress={() => this.searchCrimeType('BATTERY')}
                        />
                        <Text style={{ fontSize: 8 }}>BATTERY</Text>
                        <Text style={{ fontSize: 8 }}>{crimeTypeCount['BATTERY'] ? crimeTypeCount['BATTERY'] : 0}</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<TypeIcon name='home-alert' size={30} action={this.updateTypeButtonPressed}/>}
                            onPress={() => this.searchCrimeType('DAMAGE')}
                        />
                        <Text style={{ fontSize: 8 }}>DAMAGE</Text>
                        <Text style={{ fontSize: 8 }}>{crimeTypeCount['CRIMINAL DAMAGE'] ? crimeTypeCount['CRIMINAL DAMAGE'] : 0}</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<TypeIcon name='tea' size={30} action={this.updateTypeButtonPressed}/>}
                            onPress={() => this.searchCrimeType('NARCOTICS')}
                        />
                        <Text style={{ fontSize: 8 }}>NARCOTICS</Text>
                        <Text style={{ fontSize: 8 }}>{crimeTypeCount['NARCOTICS'] ? crimeTypeCount['NARCOTICS'] : 0}</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<TypeIcon name='karate' size={30} action={this.updateTypeButtonPressed}/>}
                            onPress={() => this.searchCrimeType('ASSAULT')}
                        />
                        <Text style={{ fontSize: 8 }}>ASSAULT</Text>
                        <Text style={{ fontSize: 8 }}>{crimeTypeCount['ASSAULT'] ? crimeTypeCount['ASSAULT'] : 0}</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<TypeIcon name='fire' size={30} action={this.updateTypeButtonPressed}/>}
                            onPress={() => this.searchCrimeType('ARSON')}
                        />
                        <Text style={{ fontSize: 8 }}>ARSON</Text>
                        <Text style={{ fontSize: 8 }}>{crimeTypeCount['ARSON'] ? crimeTypeCount['ARSON'] : 0}</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<TypeIcon name='garage-alert' size={30} action={this.updateTypeButtonPressed}/>}
                            onPress={() => this.searchCrimeType('BURGLARY')}
                        />
                        <Text style={{ fontSize: 8 }}>BURGLARY</Text>
                        <Text style={{ fontSize: 8 }}>{crimeTypeCount['BURGLARY'] ? crimeTypeCount['BURGLARY'] : 0}</Text>
                    </View>
                </View>
            </View>
        );
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        flex: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    userProfileButtonContainer: {
        position: 'absolute',
        top: '79%',
        right: '0%',
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'column',
        position: 'absolute',
        flex: 1,
        top: '5%',
        right: '0%',
        alignItems: 'center',
        width: '15%',
    },
});
