import React, { Component } from 'react';
import {  StyleSheet,View,Text, Image } from 'react-native';

const styles = StyleSheet.create({
   
    logoView:{
      flex: 1,
   
      justifyContent:'center',
      alignItems: 'center',
      height:100
  
    },
  
  });

class Title extends Component{
    render()

    {return (
        <View style={styles.logoView}>
              <Image style={{height:250}} resizeMode = 'contain' source= {require('../assets/ur.jpeg')}></Image>
              <Text style={{padding:5,fontSize:30,fontWeight:'bold',fontFamily:'Arial'}} >Urturn </Text>
              <Text style={{fontSize:20,fontFamily:'Arial'}} >Description here</Text>
        </View>
    )}
}
export default Title