import 'react-native-gesture-handler';
import React, { createContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Title from './components/Title';
import { Ionicons } from '@expo/vector-icons';
import Preferences from './components/preferences'
import SettingsPage from './components/SettingsPage';
import HomeScreen from './components/HomeScreen';
import * as firebase from "firebase";
import firebaseConfig from './firebase.json';
import Dialog from "react-native-dialog";

import { BACKEND_URL, TEST_ROOM } from 'react-native-dotenv';
import Axios from 'axios';
import DbUserContext from './context';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function messagingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chat here!</Text>
    </View>
  );
}


export default function App() {
  if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
  }

  // Set an initializing state until Firebase can connect
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [dbUser, setDbUser] = useState();
  const [errorNotif, setErrorNotif] = useState();

  async function makeLoginRequest() {
    if (!firebase.auth().currentUser) {
      return;
    }

    // create account with our backend
    const token = await firebase.auth().currentUser.getIdToken();
    const config = { headers: { Authorization: token } };
    const res = await Axios.post(`${BACKEND_URL}/user/login`, null, config);

    console.log("SETTING DB USER");
    setDbUser(res.data);
    console.log(dbUser);
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    makeLoginRequest();
    if (initializing) setInitializing(false);
  }

  // Handle creating new account
  async function onCreateAccount(email, password) {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      setErrorNotif(error.message);
    }
  }

  // Handle login attempt
  async function onLogin(email, password) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      setErrorNotif(error.message);
    }
  }

  // Logging out
  function onLogout() {
    firebase.auth().signOut();
  }

  // Make an authenticated request
  async function authenticatedRequest() {
    const token = await firebase.auth().currentUser.getIdToken();
    const config = { headers: { Authorization: token } };

    try {
      const res = await Axios.get(`${BACKEND_URL}/authPing`, config);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const user = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return user; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  
  if (!user) {
    return (
      <Title></Title>
    );
  }

  return (
    <DbUserContext.Provider value = {dbUser}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route})=> ({
            tabBarIcon:({focused,color,size})=>{
              let iconName;
              if(route.name=="Home")
              {
                iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
              }
              else if(route.name === 'Settings'){
                iconName = focused ? 'ios-list-box' : 'ios-list'
              }
              else if(route.name === 'Preferences'){
                iconName = focused ? 'md-options':'ios-options'
              }
              else if(route.name === 'Messaging'){
                iconName = focused ? 'md-chatboxes':'ios-chatboxes'
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          })}
          tabBarOptions={{activeTintColor: 'tomato', inactiveTintColor:'gray'}}>

          <Tab.Screen name = "Home" component ={HomeScreen}/>
          <Tab.Screen name = "Preferences" component ={Preferences}/>
          <Tab.Screen name = "Messaging" component ={messagingScreen}/>
          <Tab.Screen name = "Settings" component ={SettingsPage}/>
          
        </Tab.Navigator>
      </NavigationContainer>
    </DbUserContext.Provider>
  );
  
}
 
const styles = StyleSheet.create({
  parentView:{
    flex:1,
    
  },
  topView:
  {
    flex:1,
    flexDirection: "column",
    
  },
  bottomView:
  {
    flex:1,
    backgroundColor:'lavender',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center'
   
  },
  container:
  {
    flex:1,
    backgroundColor:'#fff',
    justifyContent:'center',
  }
});