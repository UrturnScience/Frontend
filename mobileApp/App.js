import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Title from './components/Title';
import { Ionicons } from '@expo/vector-icons';
import Preferences from './components/preferences'
import RoomJoin from './components/RoomJoin';
import SettingsPage from './components/SettingsPage';
import HomeScreen from './components/HomeScreen';
import * as firebase from "firebase";
import firebaseConfig from './firebase.json';
import Chat from './components/chat';
import { BACKEND_URL } from 'react-native-dotenv';
import Axios from 'axios';
import { DbContext } from './context';
import { TextInput } from 'react-native-gesture-handler';

// const Stack = createStackNavigator();
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
  const [user, setUser] = useState();     // Firebase user
  const [dbUser, setDbUser] = useState(); // Db user
  const [dbRoom, setDbRoom] = useState();
  const [errorNotif, setErrorNotif] = useState();

  async function loadContexts() {
    const token = await firebase.auth().currentUser.getIdToken();
    const config = { headers: { Authorization: token } };
  
    let loadedDbUser = await loadUserContext(config);
    console.log(loadedDbUser);
    await loadRoomContext(config, loadedDbUser._id);
  }

  async function loadUserContext(config = null) {
    if (config == null) {
      const token = await firebase.auth().currentUser.getIdToken();
      config = { headers: { Authorization: token } };
    }

    const res1 = await Axios.post(`${BACKEND_URL}/user/login`, null, config);
    setDbUser(res1.data.user);
    return res1.data.user
  }

  async function loadRoomContext(config = null, userId) {
    if (config == null) {
      const token = await firebase.auth().currentUser.getIdToken();
      config = { headers: { Authorization: token } };
    }

    const res2 = await Axios.get(`${BACKEND_URL}/roomuser/user/${userId}`, config);
    if (res2.data.roomUser == null) {
      console.log("USER IS NOT IN ROOM");
      setDbRoom("");
    } else {
      setDbRoom(res2.data.roomUser.roomId);
    }
  }

  async function makeLoginRequest() {
    if (!firebase.auth().currentUser) {
      return;
    }

    // create account with our backend
    try {
      await loadContexts();
    } catch(e) {
      console.error(e);
    }
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    makeLoginRequest();
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const user = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return user; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  
  if (!user) {
    return (
      <Title loadContext={loadContexts}></Title>
    );
  } else if (user && !dbUser && !dbRoom) {
    return (
      <Text>No User in the database!</Text>
    );
  } else if (user && dbUser && !dbRoom) {
    return (
      <DbContext.Provider value = {{user: dbUser, room: ""}}>
        <RoomJoin reloadContext={{user: loadUserContext, room: loadRoomContext, all: loadContexts}}></RoomJoin>
      </DbContext.Provider>
    );
  }

  return (
    <DbContext.Provider value = {{ user: dbUser, room: dbRoom }}>
      <NavigationContainer ref={navigationRef}>
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
          <Tab.Screen name = "Messaging" component ={Chat}/>
          <Tab.Screen name = "Settings" component ={SettingsPage}/>
          
        </Tab.Navigator>
      </NavigationContainer>
    </DbContext.Provider>
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