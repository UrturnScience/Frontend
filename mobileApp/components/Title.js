import React, { Component } from 'react';
import { ImageBackground, StyleSheet,View,Text, Image } from 'react-native';
import Email from './emailAuth'
import firebase from 'firebase'

const styles = StyleSheet.create({
  parentView:{
    flex:1,
    resizeMode: 'contain',
    width:'100%',
    height:'100%',
    justifyContent: "center",
  },
  childView: {
    padding: 20,
    margin: 15,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    shadowColor: 'darkgrey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2
  },
  topView:{
    justifyContent:'center',
    flexDirection:"column",
    alignItems:'center',
    paddingTop: 15,
  },
  logoView:{
    justifyContent:'center',
    alignItems: 'center',
  },
  bottomView:{
    justifyContent:'flex-start',
    paddingBottom: 10,
  }
});

class Title extends Component{

  constructor(props)
  {
    super(props)
  }

  isUserEqual = (googleUser, firebaseUser) => {
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

  onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken    
        );
        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function(){
            console.log('\nUser Signed In With Google\n')
            if(result.additionalUserInfo.isNewUser){
              firebase
              .database()
              .ref('/users/' + result.user.uid)
              .set({
                gmail: result.user.email,
                profile_picture: result.additionalUserInfo.profile.picture,
                locale: result.additionalUserInfo.profile.locale,
                first_name: result.additionalUserInfo.profile.given_name,
                last_name: result.additionalUserInfo.profile.family_name,
                created_at: Date.now()
              })
            }else{
              firebase
              .database()
              .ref('/users/' + result.user.uid).update({
                last_logged_in: Date.now()
              })
            }
          })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    }.bind(this));
  }

  render()
  {
    return (
      <ImageBackground style={styles.parentView} source = {require('../assets/room.jpeg')}>
          <View style={styles.childView}>
            <View style={styles.topView}>
              <View style={styles.logoView}>
                  <Image style={{height:50}} resizeMode = 'contain' source= {require('../assets/ur.png')}></Image>
                  <Text style={{fontSize:20}} >Improving Shared Living</Text>
              </View>
          </View>
            
          <View style = {styles.bottomView}>
              <Email reloadContext={this.props.reloadContext}/>
          </View>
        </View>
      </ImageBackground>
    )
  }  
}

export default Title