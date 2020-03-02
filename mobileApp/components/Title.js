import React, { Component } from 'react';
import {Alert, ImageBackground, StyleSheet,View,Text, Image } from 'react-native';
import { Button,Item } from 'native-base';
import Email from './emailAuth'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Google from 'expo-google-app-auth';
import firebase from '../firebase'
import * as Facebook from 'expo-facebook'; 


const styles = StyleSheet.create({
  parentView:{
    flex:1,
    resizeMode: 'contain',
    width:'100%',
    height:'100%'

  },
   topView:{
    flex:.5,
   
    justifyContent:'center',
    flexDirection:"column",
    alignItems:'center',
   },
    logoView:{
      flex: .3,
      marginTop:50,
      justifyContent:'center',
      alignItems: 'center',
     
      height:50,
      marginBottom:20
  
    },
    socialView:{
      flex:.5,
      justifyContent:'center',
     
      padding:10,
      width:400,
      alignItems:'center'
    },


    bottomView:{
      flex:.5,
      justifyContent:'center',
      

    
    },
    botTextView:{
      flex:.3,
      
      justifyContent: 'center'

    }
  });

class Title extends Component{

constructor(props)
{
  super(props)

}

componentDidMount()
{
  firebase.auth().onAuthStateChanged((user)=>{
    if(user!=null)
    {
      console.log(user)
    }
  })
}
loginWithFacebook =async() =>{

  //ENTER YOUR APP ID 
  try {
    await Facebook.initializeAsync('530414334250080');
    const {
      type,
      token,
    } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile'],
    });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
      // Set persistent auth state
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      await firebase.auth.Auth.signInWithCredential(credential);  // Sign in with Facebook credential
      
    } else {
      // type === 'cancel'
    }
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
}



isUserEqual=(googleUser, firebaseUser)=> {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}

onSignIn=(googleUser)=> {
  console.log('Google Auth Response', googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    
      // Build Firebase credential with the Google ID token.
      var credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.getAuthResponse().id_token);
      // Sign in with credential from the Google user.
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    
  }.bind(this));
}
 signInWithGoogleAsync = async ()=> {
  try {
    const result = await Google.logInAsync({
      behavior: 'web',
      iosClientId: "317402185170-u4fl89577bfpmftiunf00u00cncejr5d.apps.googleusercontent.com",
      scopes: ['profile', 'email'],
    });

    if (result.type === 'success') {
      this.onSignIn(result)
      return result.accessToken;
    } else {
      return { cancelled: true }
    }
  } catch (e) {
    return { error: true }
  }
}

render()
{
  return (
    <ImageBackground style={styles.parentView} source = {require('../assets/room.jpeg')}>
        <View style={styles.topView}>
          <View style={styles.logoView}>
              <Image style={{height:50}} resizeMode = 'contain' source= {require('../assets/ur.png')}></Image>
              <Text style={{padding:5,fontSize:30,fontWeight:'bold',fontFamily:'Arial'}} >Urturn </Text>
              <Text style={{fontSize:20,fontFamily:'Arial'}} >Improving shared living</Text>
          </View>
              
              
              <View style= {styles.socialView}>
              
                <Button 
                full rounded style = {{marginTop:10}} primary
                 onPress={()=>this.loginWithFacebook()}>
                   <Text style={{color:'white'}}> Facebook</Text>
                </Button>
            

                <Button 
                full rounded style = {{marginTop:10}} light
                 onPress={()=>this.signInWithGoogleAsync()}>
                   <Text style={{color:'black'}}> Google</Text>
                </Button>
               
                 
                
                
            </View>
            <Text style = {{marginTop:40,color: 'grey'}}>--------------------------- OR --------------------------</Text>
          
          
          
            </View>
            <View style = {styles.bottomView}>
        
            <Email/>
          
        </View>
        </ImageBackground>
    )
  }
    
  }
export default Title