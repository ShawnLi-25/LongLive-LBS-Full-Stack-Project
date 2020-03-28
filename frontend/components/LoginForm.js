/**
 * Source:
 * https://kimeowgee.com/2018/10/react-native-user-login-sign-up-example-tutorial/
 * Modified
 *
 */


import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Keyboard } from 'react-native';
const serverURL = "http://ec2-3-21-169-166.us-east-2.compute.amazonaws.com:3000/login";


export default class LoginForm extends Component {
    static navigationOptions = {
        title: "Login",
        headerStyle: {
            backgroundColor: '#03A9F4',
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    saveData = () => {
        const { email, password } = this.state;
        let loginDetails = {
            email: email,
            password: password
        }
        // if (this.props.type !== 'Login') {
            // AsyncStorage.setItem('loginDetails', JSON.stringify(loginDetails));
            // Keyboard.dismiss();
            // alert("You successfully registered. Email: " + email + ' password: ' + password);
            // this.login();
        // }
        // else if (this.props.type == 'Login') {
            // try {
            //     let loginDetails = await AsyncStorage.getItem('loginDetails');
            //     let ld = JSON.parse(loginDetails);
            //     if (ld.email != null && ld.password != null) {
            //         if (ld.email == email && ld.password == password) {
            //             alert('Go in!');
            //         } else {
            //             alert('Email and Password does not exist!');
            //         }
            //     }
            // } catch (error) {
            //     alert(error);
            // }
        // }
        // fetch(serverURL, {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         email: email,
        //         password: password,
        //     }),
        // }).then(response => {
        //     if (response.status == 200) {
        //         this.props.navigation.navigate("MapPage");
        //     }
        // }) 
        this.props.navigation.navigate("MapPage");
    }
    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.inputBox}
                    onChangeText={(email) => this.setState({ email })}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Email"
                    placeholderTextColor="#002f6c"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={() => this.password.focus()} />

                <TextInput style={styles.inputBox}
                    onChangeText={(password) => this.setState({ password })}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor="#002f6c"
                    ref={(input) => this.password = input}
                />
                <TouchableOpacity style={styles.button}>
                    <Button
                        title="Log In"
                        color='white'
                        style={styles.buttonText}
                        onPress={this.saveData}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 500,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBox: {
        width: 300,
        height: 50,
        backgroundColor: '#eeeeee',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10
    },
    button: {
        width: 300,
        backgroundColor: '#4f83cc',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 12,
        color: '#FFB6C1'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
        
    }
});