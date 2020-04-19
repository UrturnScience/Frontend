import React, { Component } from 'react';
import firebase from 'firebase';
import {View, TouchableOpacity, StyleSheet, Text, Clipboard} from 'react-native';
import { Button } from 'native-base';
import { DbContext } from '../context';
import { logout as makeLogoutRequest, unregisterExpoToken } from "../src/request";

class SettingsPage extends Component {

    static contextType = DbContext;

    copyToClipboard = async () => {
        await Clipboard.setString(this.context.room);
        alert("Room ID copied to clipboard");
    };

    logout = async () => {
        if(this.context.expoPushToken){
            await unregisterExpoToken(this.context.expoPushToken);
        }
        
        firebase.auth().signOut().then(() => {
            console.log('\nLogout Successful\n');
        });
        makeLogoutRequest();
    }

    render() {
        return (
            
            <View style={styles.container}>
                
                <Button style={styles.roomIdContainer} onPress={this.copyToClipboard}>
                    <Text style={styles.buttonText}>Copy Room ID</Text>
                    <Text style={styles.roomIdText}>{this.context.room}</Text>
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
    },
    buttonText:{
        color:'white',
        fontSize: 20,
        padding: 5,
    },
    roomIdText: {
        color: 'white',
        fontSize: 13,
        paddingBottom: 5,
    },
    buttonContainer:{
        backgroundColor:'tomato',
        padding: 15,
        width: '70%',
        height: 'auto',
        justifyContent:'center',
        marginTop: 25,
    },
    roomIdContainer: {
        backgroundColor: '#3284f7',
        padding: 15,
        width: '70%',
        height: 'auto',
        justifyContent: 'center',
        marginBottom: 25,
        flexDirection: 'column',
    }
});

export default SettingsPage;