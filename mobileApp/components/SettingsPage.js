import React, { Component } from 'react';
import firebase from 'firebase';
import {View, TouchableOpacity, StyleSheet, Text, Clipboard} from 'react-native';
import { Button } from 'native-base';
import { DbContext } from '../context';

class SettingsPage extends Component {

    static contextType = DbContext;

    copyToClipboard = async () => {
        await Clipboard.setString(this.context.room);
        alert("Room ID copied to clipboard");
    };

    logout = async () => {
        firebase.auth().signOut().then(() => {
            console.log('\nLogout Successful\n');
        });
    }

    render() {
        return (
            
            <View style={styles.container}>
                
                <Button style={styles.roomIdContainer} onPress={this.copyToClipboard}>
                    <Text style={styles.buttonText}>Copy Room ID</Text>
                </Button>

                <Button style={styles.buttonContainer} onPress={this.logout}>
                     <Text style={styles.buttonText}>Logout</Text>
                 </Button>
            
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:20,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'green'
    },
    buttonText:{
        color:'white',
        // fontWeight:'bold',
        fontSize: 18,
    },
    buttonContainer:{
        backgroundColor:'tomato',
        padding:15,
        width: '60%',
        justifyContent:'center',
        marginTop: 25,
    },
    roomIdContainer: {
        backgroundColor: '#3284f7',
        padding: 15,
        width: '60%',
        justifyContent:'center',
        marginBottom: 25,
    }
});

export default SettingsPage;