import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Keyboard, Picker, ActionSheet} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown'
import { Header, Icon } from 'react-native-elements'
const crimeTypes = [{ value: 'HOMICIDE' }, { value: 'THEFT' }, { value: 'BATTERY' }, { value: 'CRIMINAL DAMAGE' }, { value: 'NARCOTICS' }, { value: 'ASSULT' }, { value: 'ARSON' }, { value: 'BURGLARY' }]
import SERVER from '../config';

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
            primaryType: 'HOMICIDE',
            navigation: this.props.navigation,
        }
    }

    updateprimaryType = (selectedType) => {
        this.setState({ primaryType: selectedType})
    }

    submit = () => {
        fetch(SERVER.REPORT, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                time: '00:00:00',
                latitude: 12345,
                longitude: 12345,
                email: 'abc@text.com',
                type: this.state.primaryType,
                // source: 'user reported',
                // crimeDescription: this.state.crimeDescription,
                // reportedLocation: this.state.reportedLocation,
                // locationDescription: this.state.locationDescription,
                // block: this.state.block,
            }),
        }).then(response => {
            if (response.status == 200) {
                alert("success");
                this.props.navigation.goBack();
            } else {
                alert(response.status);
            }
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
                />
                <Dropdown
                    label='Location Description'
                    data={crimeTypes}
                    containerStyle={styles.dropdown}
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
                <TouchableOpacity style={styles.button}>
                    <Button
                        title="Submit"
                        color='white'
                        style={styles.buttonText}
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
    button: {
        marginTop: 200,
        width: '100%',
        backgroundColor: '#4f83cc',
        borderRadius: 24,
        marginVertical: 10,
        paddingVertical: 12,
        color: '#FFB6C1'
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
        // borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10,
        // paddingVertical: 12,
    }
});
