import React, { Component } from 'react';
import firebase from 'firebase';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';

class SettingsPage extends Component{

    logout = () => {
        firebase.auth().signOut()
        console.log('\nLogout Successful\n')
    }

    render() {
        return (
            
            <View style={styles.container}>
                
                <TouchableOpacity style={styles.buttonContainer} onPress={this.logout}>
                     <Text style={styles.buttonText}>Logout</Text>
                 </TouchableOpacity>
            
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:20,
        justifyContent: 'center'
    },
    buttonText:{
        textAlign:'center',
        color:'#fff',
        fontWeight:'bold',
        fontSize:20
    },
    buttonContainer:{
        backgroundColor:'#3B3B98',
        padding:15,
        borderRadius:8,
    }
});

export default SettingsPage;