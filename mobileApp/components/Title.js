import React, { Component } from 'react';
import {  StyleSheet,View,Text, Image } from 'react-native';
import {Button, Alert } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const styles = StyleSheet.create({
   
    logoView:{
      flex: 1,
   
      justifyContent:'center',
      alignItems: 'center',
      height:100
  
    },
  
  });

function Title ({navigation}){
  return (
        <View style={styles.logoView}>
              <Image style={{height:250}} resizeMode = 'contain' source= {require('../assets/ur.jpeg')}></Image>
              <Text style={{padding:5,fontSize:30,fontWeight:'bold',fontFamily:'Arial'}} >Urturn </Text>
              <Text style={{fontSize:20,fontFamily:'Arial'}} >Improving shared living</Text>
          
          
          
          
          
          <View style={{marginTop:100, flex:1, flexDirection:'column', height:300,width:300}}>
          <View style = {{marginBottom:10,height:50, width:300, backgroundColor:'blue',alignItems:'center',justifyContent:'center'}}>
            <Button title="Facebook" onPress={()=>Alert.alert("Facebook Pressed")}/ >
          </View>

          <View style = {{marginBottom:10,width:300, height:50, backgroundColor:'antiquewhite',alignItems:'center',justifyContent:'center',}}>
          <Button title="Google" onPress={()=>Alert.alert("Google Pressed")}/ >
          </View>

          <View style = {{marginBottom:10,width:300, height:50, backgroundColor:'yellow',alignItems:'center',justifyContent:'center',}}>
          <Button title="Email" 
          onPress={()=>navigation.navigate('Email')} />
          </View>
        </View>
        </View>
    )}

export default Title