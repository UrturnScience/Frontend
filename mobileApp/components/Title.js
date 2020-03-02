import React, { Component } from 'react';
import {Alert, ImageBackground, StyleSheet,View,Text, Image } from 'react-native';
import { Button,Item } from 'native-base';
import Email from './emailAuth'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


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
                 onPress={()=>Alert.alert("Facebook Pressed")}>
                   <Text style={{color:'white'}}> Facebook</Text>
                </Button>
            

                <Button 
                full rounded style = {{marginTop:10}} light
                 onPress={()=>Alert.alert("Facebook Pressed")}>
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