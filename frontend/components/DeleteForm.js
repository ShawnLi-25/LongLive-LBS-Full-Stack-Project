import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Header, Icon } from 'react-native-elements'
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
                <Header placement='center'
                    containerStyle={{
                        backgroundColor: '#f1f1f1',
                        justifyContent: 'space-around',
                    }}>
                    <Icon name='close' size={25} onPress={() => { this.props.navigation.goBack(); }}></Icon>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#002f6c' }}>Delete</Text>
                </Header>
                <TextInput style={styles.inputBox}
                    onChangeText={(reportId) => this.setState({ reportId: reportId })}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Report Id"
                    placeholderTextColor="#002f6c"
                    ref={(input) => this.password = input} />
                
                <View style={{ paddingTop: Dimensions.get('window').height * 0.7 }}>
                    <TouchableOpacity>
                        <Button
                            title="Delete"
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
});
