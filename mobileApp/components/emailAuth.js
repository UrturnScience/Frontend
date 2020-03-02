import React, { Component } from 'react';
import {TextInput, StyleSheet, Text, View, Image, Alert } from 'react-native';

import firebase from '../firebase'

import {Container, Content, Header, Form,Input,Item,Button, Label} from 'native-base'

function emailIsValid (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
export default class emailAuth extends Component {
  constructor(props)
  {
    super(props)
    this.state= ({
      email: "",
      password: ""
    })
  }
  
  
  signup =(email, password) =>{
    try{
      if(this.state.password.length<1||this.state.email.length<0)
      {
          alert("Please fill in both email and password")
          return;
      }
      else if(emailIsValid(this.state.email)==false)
      {
        alert("Please enter a valid email!")
        return;
      }
      else if(this.state.password.length<6)
      {
        alert("Please enter at least 6 characters long!")
        return;
      }
      
  
  
      firebase.auth().createUserWithEmailAndPassword(email,password)
      alert("Congrats you have signed up with email!")
    }
    catch(error)
    {
      console.log(error.toString())
    }
  }

  login =(email, password) =>{
    try{
        if(this.state.password.length<1||this.state.email.length<0)
        {
            alert("Please fill in both email and password")
            return;
        }
        else if(emailIsValid(this.state.email)==false)
        {
          alert("Please enter a valid email!")
          return;
        }
        else if(this.state.password.length<6)
        {
          alert("Please enter password at least 6 characters long!")
          return;
        }
        
      firebase.auth().signInWithEmailAndPassword(email,password).then(function(user){
        console.log(user)
      }
      )
    }
    catch(error)
    {
      console.log(error.toString())
    }
  }

render(){
  return (
    <View style={styles.container}> 
      <Form>
         
        <Item floatingLabel>
          <Label style={{color:'black'}}>Email:</Label>
          <Input
          
          onChangeText = {(email) => this.setState({email})}
          autoCorrect = {false}
          autoCapitailize = "none"
        />
        </Item>

        <Item floatingLabel>
          <Label style={{color:'black'}}>Password:</Label>
          <Input
          secureTextEntry = {true}
          autoCorrect = {false}
          autoCapitailize = "none"
          onChangeText = {(password) => this.setState({password})}
        />
        </Item>
        
        <Button style = {{marginTop:10}}
        full rounded success
        onPress = {()=> this.login(this.state.email,this.state.password)}>

          <Text style={{color:'white'}}> Login</Text>
        </Button>

        <Button style = {{marginTop:10}}
        full rounded warning
        onPress = {()=> this.signup(this.state.email,this.state.password)}>

          <Text style= {{color: 'black'}}> Sign Up</Text>
        </Button>
      </Form>
    </View>
  );
}
}
 
const styles = StyleSheet.create({
  parentView:{
    flex:1,
    
  },
 
  container:
  {
    flex:1,
    justifyContent:'center',
    padding:10,
    marginBottom:200,
    marginTop:30
  
  }



});