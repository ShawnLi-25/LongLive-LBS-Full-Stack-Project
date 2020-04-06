import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import { Button, Image } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions, TouchableHighlight, TextInput } from 'react-native';
import data from '../Data/test.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SERVER from '../config';
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
        // this.showDescriptionOnMarker = this.showDescriptionOnMarker.bind(this);
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
        const { marker } = this.state.markers[index];
        this.setState({ currentMarkerPressed: !this.state.currentMarkerPressed });
        let latitude = event.nativeEvent.coordinate.latitude;
        let longitude = event.nativeEvent.coordinate.longitude;
        let requestString = SERVER.ROOT  + `?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
        console.log(requestString);
        // try {
        //     fetch(requestString, {
        //         method: "GET",
        //         // headers: headers,
        //     }).then(response => {
        //         console.log(response.status);
        //     })
        // } catch(err) {
        //     console.log(err);
        // }
       
        
        // .then(response => {
        //     if (response.status == 200) {
        //         alert("success");
        //         // this.props.navigation.goBack();
        //         // this.props.navigation.navigate("MapPage");
        //     } else {
        //         console.log(response.status);
        //     }
        // })
        // request with latitude, latitude
        // fetch(serverURL, {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         latitude: latitude,
        //         longitude: longitude,
        //         // crimeDescription: this.state.crimeDescription,
        //         // reportedLocation: this.state.reportedLocation,
        //         // locationDescription: this.state.locationDescription,
        //         // block: this.state.block,
        //     }),
        // }).then(response => {
        //     if (response.status == 200) {
        //         alert("success");
        //         this.props.navigation.goBack();
        //         // this.props.navigation.navigate("MapPage");
        //     } else {
        //         alert("failed");
        //     }
        // }) 
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

    searchCrimeType = crimeType => {
        console.log(crimeType);
    }

    render() {
        const buttons = ['Hello', 'World', 'Buttons']
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
                    // region={this.state.currentRegion}
                    onRegionChange={this.onRegionChange}
                    onPress={(event) => { this.createMarkerOnPress(event) }}
                >
                    {this.state.markers.map((marker, index) => (
                        <Marker
                            draggable 
                            stopPropagation
                            calloutVisible
                            key={index}
                            onPress={(event) => { this.showDescriptionOnMarker(event, index)}}
                            position={this.position}
                            // onDrag={(event) => this.setState({ x: event.nativeEvent.coordinate })}
                            {...marker}
                        >
                            <MapView.Callout tooltip={true}>
                                <Button 
                                    large
                                    raised
                                    title="Search Criminal Records"
                                    // onPress={(event) => { this.showDescriptionOnMarker(event, index) }}
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
                        icon={<Icon name='face-profile' size={60} />}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <View style={{ backgroundColor: 'white', alignItems: 'center'}}>
                        <Button
                            buttonStyle={{backgroundColor: 'white'}}
                            type='clear'
                            icon={<Icon name='knife' size={30} />}
                            onPress={() => this.searchCrimeType('HOMICIDE')}
                        />
                        <Text style={{ fontSize: 8}}>HOMICIDE</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<Icon name='account-remove' size={30} />}
                            onPress={() => this.searchCrimeType('THEFT')}
                        />
                        <Text style={{ fontSize: 8 }}>THEFT</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<Icon name='kabaddi' size={30} />}
                            onPress={() => this.searchCrimeType('BATTERY')}
                        />
                        <Text style={{ fontSize: 8 }}>BATTERY</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<Icon name='home-alert' size={30} />}
                            onPress={() => this.searchCrimeType('DAMAGE')}
                        />
                        <Text style={{ fontSize: 8 }}>DAMAGE</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<Icon name='tea' size={30} />}
                            onPress={() => this.searchCrimeType('NARCOTICS')}
                        />
                        <Text style={{ fontSize: 8 }}>NARCOTICS</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<Icon name='drupal' size={30} />}
                            onPress={() => this.searchCrimeType('ASSULT')}
                        />
                        <Text style={{ fontSize: 8 }}>ASSULT</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<Icon name='fire' size={30} />}
                            onPress={() => this.searchCrimeType('ARSON')}
                        />
                        <Text style={{ fontSize: 8 }}>ARSON</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                        <Button
                            type='clear'
                            icon={<Icon name='garage-alert' size={30} />}
                            onPress={() => this.searchCrimeType('BURGLARY')}
                        />
                        <Text style={{ fontSize: 8 }}>BURGLARY</Text>
                    </View>
                </View>
               
            </View>
        );
    }
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
        position: 'absolute', //use absolute position to show button on top of the map
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
        alignItems: 'center'
    },
});
