import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, FlatList} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown'
import { Header, Icon } from 'react-native-elements'
const crimeTypes = [{ value: 'HOMICIDE' }, { value: 'THEFT' }, { value: 'BATTERY' }, { value: 'CRIMINAL DAMAGE' }, { value: 'NARCOTICS' }, { value: 'ASSULT' }, { value: 'ARSON' }, { value: 'BURGLARY' }]
import SERVER from '../config';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

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
        } catch (E) {
            console.log(E);
        }
        
    };

    submit = () => {
        let UplodedFile = new FormData();
        UplodedFile.append('img', { type: 'image/jpeg', uri: this.state.attachment.uri, name: 'user_uploaded.jpeg' });
        UplodedFile.append('time', '00:00:00');
        UplodedFile.append('latitude', 12345);
        UplodedFile.append('longitude', 12345);
        UplodedFile.append('email', 'abc@text.com');
        UplodedFile.append('type', this.state.primaryType);
        UplodedFile.append('description', this.state.crimeDescription);
        fetch(SERVER.TEST, {
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
    }

    render() {
        return(
            <View style={styles.container}>
                <Header placement='left'>
                    <Icon name='close' onPress={() => { this.props.navigation.goBack(); }}></Icon>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#002f6c' }}>Report a Crime</Text>
                </Header>
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
                <TextInput style={styles.inputBox}
                    onChangeText={(block) => this.setState({ block })}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Block"
                    placeholderTextColor="#002f6c"
                    ref={(input) => this.password = input}
                /> 
                <TouchableOpacity style={styles.attachmentButton}>
                    <Button
                        title="Upload attachment"
                        color='white'
                        raised
                        onPress={this.handleChooseAttachment}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Button
                        title="Submit"
                        color='white'
                        raised
                        onPress={this.submit}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({

    container: {
        // marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBox: {
        width: '100%',
        height: 50,
        backgroundColor: '#eeeeee',
        // borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10,
        
        textAlign: 'justify',
    },
    attachmentButton: {
        width: '100%',
        // marginTop: 160,
        backgroundColor: '#4f83cc',
        borderRadius: 24,
        marginVertical: 10,
        paddingVertical: 12,
        color: '#FFB6C1',
    },

    button: {
        width: '100%',
        // marginTop: 10,
        backgroundColor: '#4f83cc',
        borderRadius: 24,
        marginVertical: 10,
        paddingVertical: 12,
        color: '#FFB6C1',

    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
    },
    dropdown: {
        width: '100%',
        height: 50,
        backgroundColor: '#eeeeee',
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10,
    }, 
    flatlistStyle: {
        flex: 1,
        width: '100%',
    }
});
