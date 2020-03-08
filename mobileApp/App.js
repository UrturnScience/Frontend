import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Title from './components/Title'
import { Ionicons } from '@expo/vector-icons';
import Preferences from './components/preferences'


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}
function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}
function preferencesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Preferences!</Text>
    </View>
  );
}
function messagingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chat here!</Text>
    </View>
  );
}

export default class App extends Component {
  
render(){
  return (
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
      <Tab.Screen name = "Settings" component ={SettingsScreen}/>
      
      </Tab.Navigator>

    </NavigationContainer>
   
  );
}
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
    padding:10
  }



});