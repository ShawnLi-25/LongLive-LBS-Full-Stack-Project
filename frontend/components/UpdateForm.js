import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown'
import { Button, Header, Icon } from 'react-native-elements'
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
                <Header placement='center'
                    containerStyle={{
                        backgroundColor: '#f1f1f1',
                        justifyContent: 'space-around',
                    }}>
                    <Icon name='close' size={25} onPress={() => { this.props.navigation.goBack(); }}></Icon>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#002f6c' }}>Update</Text>
                </Header>
                <View style={styles.infoContainer}>
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
                </View>
                <View style={{ paddingTop: Dimensions.get('window').height * 0.5 }}>
                    <TouchableOpacity>
                        <Button
                            title="Update"
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
