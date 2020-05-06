import React from 'react';
import { Header, Icon } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TouchableHighlight } from 'react-native';
export default class UserSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation,
        }
    }
    render() {
        return(
            <View>
                <Header placement='center'
                    containerStyle={{
                        backgroundColor: '#f1f1f1',
                        justifyContent: 'space-around',
                    }}>
                    <Icon name='close' size={25} onPress={() => { this.props.navigation.goBack(); }}></Icon>
                </Header>
                <TouchableOpacity style={styles.userInfoUpdaeButtonStyle} >
                    <Text style={styles.textStyle}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.userInfoUpdaeButtonStyle} >
                    <Text style={styles.textStyle}>Name</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.userInfoUpdaeButtonStyle} >
                    <Text style={styles.textStyle}>Birthday</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.userInfoUpdaeButtonStyle} >
                    <Text style={styles.textStyle}>Friends</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    headerStyle: {

    },
    userInfoUpdaeButtonStyle: {
        shadowColor: 'white',
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        backgroundColor: '#f1f1f1',
        elevation: 2,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        textAlign: 'right',
    },
    textStyle: {
        color: '#808080'
    }
})