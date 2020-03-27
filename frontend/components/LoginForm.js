import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Keyboard } from 'react-native';


export default class LoginForm extends Component {
    static navigationOptions = {
        title: "Login",
        headerStyle: {
            backgroundColor: '#03A9F4',
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText} >Login</Text>
                <Button
                    title="Show Map"
                    onPress={() => this.props.navigation.navigate("MapPage")}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    headerText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold'
    },

});
