import React, { Component } from 'react';
import {View,Text,Button, Alert } from 'react-native';


class Buttons extends Component{
    render()

    {return (
   
        <View style={{flex:1, flexDirection:'column', height:300,width:300}}>

          <View style = {{marginBottom:10,height:50, width:300, backgroundColor:'blue',alignItems:'center',justifyContent:'center'}}>
            <Button title="Facebook" onPress={()=>Alert.alert("Facebook Pressed")}/ >
          </View>

          <View style = {{marginBottom:10,width:300, height:50, backgroundColor:'antiquewhite',alignItems:'center',justifyContent:'center',}}>
          <Button title="Google" onPress={()=>Alert.alert("Google Pressed")}/ >
          </View>

          <View style = {{marginBottom:10,width:300, height:50, backgroundColor:'yellow',alignItems:'center',justifyContent:'center',}}>
          <Button title="Email" onPress={()=>Alert.alert("Email Pressed")}/ >
          </View>
        </View>

       
    )}
}
export default Buttons