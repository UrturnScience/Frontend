import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import Title from './components/Title'
import Buttons from './components/LoginButtons'
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


});
export default class App extends Component {
  

render(){
  return (
    <View style = {styles.parentView}>
      <View style = {styles.topView}>
        <Title/>
      </View>
      <View style = {styles.bottomView}>
        <Buttons/>
      </View>

    </View>
  );
}
}

