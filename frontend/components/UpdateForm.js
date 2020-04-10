import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown'
import { Header, Icon } from 'react-native-elements'
import SERVER from '../config';
const crimeTypes = [{ value: 'HOMICIDE' }, { value: 'THEFT' }, { value: 'BATTERY' }, { value: 'CRIMINAL DAMAGE' }, { value: 'NARCOTICS' }, { value: 'ASSULT' }, { value: 'ARSON' }, { value: 'BURGLARY' }]
export default class ReportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportId: 0,
            crimeDescription: ' ',
            primaryType: 'HOMICIDE',
            navigation: this.props.navigation,
        }
    }

    submit = () => {
        fetch(SERVER.REPORT, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reportID: this.state.reportId,
                type: this.state.primaryType,
                description: this.state.description,
            }),
        }).then(response => {
            if (response.status == 200) {
                alert("Success");
            } else {
                alert("Failed: " + response.status);
            }
        }).then(() => { this.props.navigation.goBack(); })
    }

    render() {
        return (
            <View>
                <Header placement='left'>
                    <Icon name='close' onPress={() => { this.props.navigation.goBack(); }}></Icon>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#002f6c' }}>Update a Reported Crime</Text>
                </Header>
                <Dropdown
                    label='Crime Type'
                    data={crimeTypes}
                    onChangeText={(type) => this.setState({ primaryType: type})}
                    containerStyle={styles.dropdown}/>
                <TextInput style={styles.inputBox}
                    onChangeText={(reportId) => this.setState({ reportId: reportId })}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Report Id"
                    placeholderTextColor="#002f6c"
                    ref={(input) => this.password = input}/>
                <TextInput style={styles.inputBox}
                    onChangeText={(crimeDescription) => this.setState({ crimeDescription: crimeDescription })}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Description"
                    placeholderTextColor="#002f6c"
                    ref={(input) => this.password = input}/>
                <TouchableOpacity style={styles.button}>
                    <Button
                        title="Update"
                        color='white'
                        raised
                        onPress={this.submit}/>
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
        width: '100%',
        marginTop: 400,
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
});
