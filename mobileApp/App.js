import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style = {styles.parentView}>
      <View style = {styles.topView}>

          <View style={styles.logoView}>
              <Image style={{height:250}} resizeMode = 'contain' source= {require('./ur.jpeg')}></Image>
              <Text style={{padding:5,fontSize:30,fontWeight:'bold',fontFamily:'Arial'}} >Urturn </Text>
              <Text style={{fontSize:20,fontFamily:'Arial'}} >Description here</Text>
          </View>

      </View>
      <View style = {styles.bottomView}>
        <View style={{height:300,width:300}}>

          <View style = {{height:50,width:500,width:300, backgroundColor:'green',alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:20,fontFamily:'Arial'}} >facebook</Text>
          </View>

          <View style = {{width:300, height:50, backgroundColor:'blue',alignItems:'center',justifyContent:'center',}}>
            <Text style={{fontSize:20,fontFamily:'Arial'}} >google</Text>
          </View>

          <View style = {{width:300, height:50, backgroundColor:'yellow',alignItems:'center',justifyContent:'center',}}>
            <Text style={{fontSize:20,fontFamily:'Arial'}} >email</Text>
          </View>

        </View>
        

      </View>

    </View>
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
    flex:1.2,
    backgroundColor:'red',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center'
   
  },

  logoView:{
    flex: 1,
    backgroundColor: 'blue',
    justifyContent:'center',
    alignItems: 'center',
    height:100

  },

  



  
});
