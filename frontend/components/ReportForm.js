import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown'
import { Header, Button } from 'react-native-elements'
const crimeTypes = [{ value: 'HOMICIDE' }, { value: 'THEFT' }, { value: 'BATTERY' }, { value: 'CRIMINAL DAMAGE' }, { value: 'NARCOTICS' }, { value: 'ASSULT' }, { value: 'ARSON' }, { value: 'BURGLARY' }]
import SERVER from '../config';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ReportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: '',
            longitude: '',
            crimeDescription: '',
            reportedLocation: '',
            locationDescription: '',
            block: '',
            date: '',
            email: '',
            attachment: null,
            primaryType: 'HOMICIDE',
            navigation: this.props.navigation,
            showScrollView: false,
        }
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    updateprimaryType = (selectedType) => {
        this.setState({ primaryType: selectedType})
    }

    handleChooseAttachment = async () => {
        try {
            this.getPermissionAsync();
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                allowsMultipleSelection: true,
            });
            if (!result.cancelled) {
                this.setState({ attachment: result });
            }
        } catch (err) {
            console.log(err);
        }
        
    };

    getRandomLoc = () => {
        let lat_upper_bound = 42000, lat_lower_bound = 41800,
        lng_upper_bound = 87800, lng_lower_bound = 87500;
        let rand_lat = Math.floor(Math.random() * (lat_upper_bound - lat_lower_bound + 1) + lat_lower_bound) / 1000,
        rand_lng = -Math.floor(Math.random() * (lng_upper_bound - lng_lower_bound + 1) + lng_lower_bound) / 1000;
      return [rand_lat, rand_lng];
    }
    submit = () => {
        try {
            var randomLocation = this.getRandomLoc();
            var randomLatitude = randomLocation[0];
            var randomLongitude = randomLocation[1];
            this.setState({ latitude: randomLatitude });
            this.setState({ longitude: randomLongitude });
            let time = new Date();
            let UplodedFile = new FormData();
            UplodedFile.append('time', time);
            UplodedFile.append('latitude', this.state.latitude);
            UplodedFile.append('longitude', this.state.longitude);
            UplodedFile.append('email', 'admin@test.com');
            UplodedFile.append('type', this.state.primaryType);
            UplodedFile.append('description', this.state.crimeDescription);
            let reportEndPoint = SERVER.REPORT;
            if (this.state.attachment) {
                UplodedFile.append('img', 
                { type: 'image/jpeg', 
                  uri: this.state.attachment.uri, 
                  name: 'user_uploaded.jpeg' });
                reportEndPoint = SERVER.REPORT + '/upload';
            } else {
                UplodedFile.append('img');
            }
            
            fetch(reportEndPoint, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: UplodedFile,
            }).then(response => {
                if (response.status == 200) {
                    alert("success");
                } else {
                    alert(response.status);
                }
                return response.json();
            }).then((data) => {
                console.log(data.reportID);
            })
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <Header placement='center' 
                        containerStyle={{
                            backgroundColor: '#f1f1f1',
                            justifyContent: 'space-around',}}>
                    <Icon name='close' size={25} onPress={() => { this.props.navigation.goBack(); }}></Icon>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#002f6c' }}>Report a Crime</Text>
                </Header>
                <View style={styles.infoContainer}>
                    <Dropdown 
                        label='Crime Type'
                        data={crimeTypes}
                        containerStyle={styles.dropdown}
                        onChangeText={(type) => this.setState({ primaryType: type })}
                    />
                    <TextInput style={styles.inputBox}
                        onChangeText={(crimeDescription) => this.setState({ crimeDescription })}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Crime Description"
                        placeholderTextColor="#002f6c"
                        selectionColor="#fff"
                        keyboardType="email-address"
                        onSubmitEditing={() => this.password.focus()} />
                    <TextInput style={styles.inputBox}
                        onChangeText={(reportedLocation) => this.setState({ reportedLocation })}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Reported Location"
                        placeholderTextColor="#002f6c"
                        ref={(input) => this.password = input}
                    />
                </View>
                <View style={styles.attachmentButton}>
                    <TouchableOpacity>
                            <Button
                                title="Upload attachment"
                                type='clear'
                                // loading
                                titleStyle={{ color: "#002f6c"}}
                                onPress={this.handleChooseAttachment}
                                icon={<Icon style={{marginLeft: 10, marginRight: 5}}name='upload' size={30}/>}
                            />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: Dimensions.get('window').height * 0.4 }}>
                    <TouchableOpacity>
                        <Button
                            title="Submit"
                            type='clear'
                            raised
                            onPress={this.submit}
                            titleStyle={{ color: "#002f6c" }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f1f1f1',
    },
    infoContainer: {
        flexDirection: 'column',
    },
    inputBox: {
        width: '100%',
        height: 50,
        backgroundColor: '#eeeeee',
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10,
        textAlign: 'justify',
    },
    attachmentButton: {
        width: '50%',
        marginVertical: 10,
        paddingVertical: 12,
    },
    dropdown: {
        width: '100%',
        height: 50,
        backgroundColor: '#eeeeee',
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 15,
    }, 
});
