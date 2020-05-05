import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, SearchBar} from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions, TouchableHighlight, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SERVER from '../config';
import TypeIcon from './TypeIcon';
import clusterfck_root from '../kmeans/clusterfck';
let clusterfck = clusterfck_root.clusterfck;

let typeCount = SERVER.typeCount;
let buttonNames = SERVER.buttonNames;
let iconNames = SERVER.iconNames;
let attachments = SERVER.attachments;
let buttonPressedStatus = buttonStatusInit(buttonNames);
let currentPressedButtons = [];
let anyButtonPressed = false;


function buttonStatusInit (names) {
    let buttonPressedStatusList = [];
    for (var i = 0; i < names.length; i++) {
        let button = {
            name: names[i],
            status: false,
        }
        buttonPressedStatusList.push(button);
    }
    return buttonPressedStatusList;
}

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

function ButtonView({...props}) {
    const ref = React.useRef();
    const buttonName = props.name;
    const crimeTypeCount = props.crimeTypeCount;
    const iconName = props.iconName;
    
    function onPressButtonView() {
        currentPressedButtons = [];
        anyButtonPressed = false;
        buttonPressedStatus.map((button, index) => {
            if (button.name == buttonName) {
                button.status = !button.status;
            }
            if (button.status) {
                anyButtonPressed = true;
                currentPressedButtons.push(button);
            }
        })
    }

    return <View ref={ref} style={{ backgroundColor: 'white', alignItems: 'center' }}>
        <Button
            buttonStyle={{ backgroundColor: 'white' }}
            type='clear'
            icon={<TypeIcon name={iconName} size={30} action={onPressButtonView} />}
        />
        <Text style={{ fontSize: 8 }}>{buttonName}</Text>
        <Text style={{ fontSize: 8 }}>{crimeTypeCount[buttonName] ? crimeTypeCount[buttonName] : 0}</Text>
    </View>
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
            searchInfo: '',
            zoom: 1,
        } 
        this.createMarkerOnPress = this.createMarkerOnPress.bind(this);
    }

    onRegionChange = (region) => {
        this.setState({ currentRegion: region })
        let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
        this.setState({zoom: zoom});
        const currentRegion = this.state.currentRegion;
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let requestType = `${SERVER.ROOT}getNearbyEvents/type?latitude=${currentRegion.latitude}&longitude=${currentRegion.longitude}&latDelta=${currentRegion.latitudeDelta}&lngDelta=${currentRegion.longitudeDelta}&year=${year}&month=${2}`;
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

        let requestPointsURL = "";
        if (!anyButtonPressed) {
            requestPointsURL = `${SERVER.ROOT}getNearbyEvents/heatmap?latitude=${currentRegion.latitude}&longitude=${currentRegion.longitude}&latDelta=${currentRegion.latitudeDelta}&lngDelta=${currentRegion.longitudeDelta}&year=${year}&month=${2}`;
            fetch(requestPointsURL)
                .then((response) => { return response.json(); })
                .then((locationData) => {
                    let fetchPointList = [];
                    
                    for (var i = 0; i < locationData.length; i++) {
                        let point = {
                            latitude: (Number(locationData[i].latitude)),
                            longitude: Number(locationData[i].longitude),
                        };
                        fetchPointList.push(point);
                    }
                    this.setState({ pointList: fetchPointList});
                });
        } else {
            let fetchPointList = [];
            currentPressedButtons.map((button, index) => {
                let type = button.name;
                requestPointsURL = `${SERVER.ROOT}getNearbyEvents/showType?latitude=${currentRegion.latitude}&longitude=${currentRegion.longitude}&latDelta=${currentRegion.latitudeDelta}&lngDelta=${currentRegion.longitudeDelta}&year=${year}&month=${2}&type=${type}`;
                fetch(requestPointsURL)
                    .then((response) => { return response.json(); })
                    .then((locationData) => {
                        for (var i = 0; i < locationData.length; i++) {
                            let point = {
                                latitude: (Number(locationData[i].latitude)),
                                longitude: Number(locationData[i].longitude),
                            };
                            // hostory_vectors[i] = [Number(locationData[i].latitude), Number(locationData[i].longitude)];
                            fetchPointList.push(point);
                        }
                        // console.log("hey");
                        // const kmeans = require('node-kmeans');
                        // kmeans.clusterize(hostory_vectors, { k: 5 }, (_, res) => {
                        //     console.log('%o', res);
                        // });
                        this.setState({ pointList: fetchPointList });
                    })
            })
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

    showSearchResult = () => {
        this.state.navigation.navigate("List");
    }
    searchAttachment = () => {
        let searchInfo = this.state.searchInfo;
        console.log(searchInfo);
        let UplodedInfo = new FormData();
        UplodedInfo.append('search', searchInfo);
        fetch(SERVER.TEST, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => { return response.json();
        }).then((images) => {
            console.log(images[0]);
            for (var i = 0; i < images.length; i++) {
                if (images[i]['img'] != null) {
                    console.log(i);
                    attachments.push(images[i]['img']);
                }
            }
            this.showSearchResult();
        })
    }
    
    getPrediction = () => {
        const predictionPointList = this.state.pointList;
        var len = predictionPointList.length;
        let predictionData = new Array(len);
        for (var i = 0; i < len; i++) {
            predictionData[i] = [];
        }
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < 2; j++) {
                predictionData[i][j] = (j == 1) ? Number(predictionPointList[i].latitude) : Number(predictionPointList[i].longitude);
            }
        }
        var kmeans = new clusterfck_root.Kmeans();
        var clusters = kmeans.cluster(predictionData, 2);
        var clusterIndex = kmeans.classify([41.88825, -87.6324]);
        console.log(clusterIndex);
    }
    render() {
        let crimeTypeCount = this.state.crimeTypeCount;
        const search = this.state.searchInfo;
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
                    onRegionChange={this.onRegionChange}>
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
                <View style={styles.searchBarContainer}>
                    <Icon style={styles.searchIcon} name="image-search" size={20} onPress={this.searchAttachment}></Icon>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(search) => this.setState({ searchInfo: search })}
                        placeholder="Type here ..."
                        placeholderTextColor="#002f6c"
                    />
                </View>
                <View style={styles.buttonContainer}>
                    {buttonNames.map((name, index) => (
                        <ButtonView name={name} crimeTypeCount={crimeTypeCount} iconName={iconNames[index]} pressStatus={buttonPressedStatus[name]}></ButtonView>
                    ))}
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
        top: '10%',
        right: '0%',
        alignItems: 'center',
        width: '15%',
    },
    searchBarContainer: {
        position: 'absolute',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        top: '5%',
        width: '100%',
        borderWidth: 0.5,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: '20%',
        // backgroundColor: '#fff',
        color: '#424242',
        // borderColor: 'black',
    },
    searchIcon: {
        // marginRight: 0,
        // marginLeft: '80%',
        
        // justifyContent:'right',
        // alignItems: 'right',
    },
});
