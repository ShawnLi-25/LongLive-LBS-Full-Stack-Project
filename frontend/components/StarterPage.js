import React, { Component } from './node_modules/react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Header, Button, Icon } from './node_modules/react-native-elements';
import MapPage from "./Map";
import Form from "./Form";

export default class StarterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {toMapPage: false};
    }
    toMapPage = () => {
        <MapPage></MapPage>
    }
    render() {
        return(
            <View style={styles.container}>
                {/* <Image
                    style={{ width: 500, height: 500 }}
                    source={require("../images/starterpage.jpg")}></Image> */}
                <Text style={styles.instructions}></Text>
                <Button 
                    icon={<Icon 
                            reverse
                            name="arrow-right"
                            size={15}
                            color="black"
                            
                            // onPress={() => this.setState({toMapPage: true})}
                            onPress={this.toMapPage}/>} 
                    type='clear' 
                    stype={styles.loginButton}>
                </Button>
            </View>
        );
    }
} 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFB6C1'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
    loginButton: {
        width: 100,
        flex: 1,
        color: 'black',
        justifyContent: 'center',
        textShadowColor: 'black',
    }
});