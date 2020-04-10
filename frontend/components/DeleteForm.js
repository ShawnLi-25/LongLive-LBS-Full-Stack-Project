import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Keyboard, Picker, ActionSheet } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown'
import { Header, Icon } from 'react-native-elements'
import SERVER from '../config';
export default class DeleteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportId: 0,
            navigation: this.props.navigation,
        }
    }

    submit = () => {
        let requestURL = SERVER.REPORT + '/' + this.state.reportId;
        fetch(requestURL, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
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
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#002f6c' }}>Delete a Reported Crime</Text>
                </Header>
                <TextInput style={styles.inputBox}
                    onChangeText={(reportId) => this.setState({ reportId: reportId })}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Report Id"
                    placeholderTextColor="#002f6c"
                    ref={(input) => this.password = input} />
                
                <TouchableOpacity style={styles.button}>
                    <Button
                        title="Delete"
                        color='white'
                        raised
                        onPress={this.submit} />
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
        marginTop: 500,
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
