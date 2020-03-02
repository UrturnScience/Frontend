import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from './firebase'
import Email from './components/emailAuth'
import Title from './components/Title'
const Stack = createStackNavigator();
export default class App extends Component {
  

render(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Title">
     
        <Stack.Screen name = "Title" component = {Title}/>
        
      </Stack.Navigator>

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