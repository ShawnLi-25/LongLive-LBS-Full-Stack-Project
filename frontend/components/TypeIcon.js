import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Image } from 'react-native-elements';
export default class TypeIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
            name: props.name,
            size: props.size,
            color: 'black',
        }
    }
    onPress = () => {
        this.props.action();
        if (!this.state.pressed) {
            this.setState({color: 'red'});
        } else {
            this.setState({ color: 'black' });
        }
        this.setState({pressed: !this.state.pressed});
        
    }
    render() {
        return (
            <Icon name={this.state.name} size={this.state.size} color={this.state.color} onPress={this.onPress}/>
        );
    }

}
