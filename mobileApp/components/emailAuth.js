import React, { Component } from 'react';
import {TextInput, StyleSheet, Text, View, Image, Alert } from 'react-native';

import firebase from 'firebase'

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
  
  signup = (email, password) =>{
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

  login = (email, password) =>{
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
        
      firebase.auth().signInWithEmailAndPassword(email,password).then(this.onLoginSuccess)
    }
    catch(error)
    {
      console.log(error.toString())
    }
  }

  onLoginSuccess = (user) => {
    console.log('\nLogin by email successful !\n')
  }

  render(){
    return (
      <View> 
        <Form>
          
          <Item floatingLabel>
            <Label style={{color:'black'}}>Email:</Label>
            <Input
            onChangeText = {(email) => this.setState({email})}
            autoCorrect = {false}
            autoCapitalize = "none"
          />
          </Item>

          <Item floatingLabel>
            <Label style={{color:'black'}}>Password:</Label>
            <Input
            secureTextEntry = {true}
            autoCorrect = {false}
            autoCapitalize = "none"
            onChangeText = {(password) => this.setState({password})}
          />
          </Item>

          <View style={styles.buttonContainer}>

            <Button style = {styles.signupButton}
            onPress = {()=> this.signup(this.state.email,this.state.password)}>

              <Text style= {{color: 'white', fontSize: 16}}>Sign Up</Text>
            
            </Button>
          
            <Button style = {styles.loginButton}
            onPress = {()=> this.login(this.state.email,this.state.password)}>

              <Text style={{color:'white', fontSize: 16}}>Login</Text>
            
            </Button>

          </View>
        </Form>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 35,
  },
  loginButton: {
    backgroundColor: "tomato",
    width: "40%",
    textAlign: "center",
    justifyContent: "center",
  },
  signupButton: {
    backgroundColor: "#3284f7",
    width: "40%",
    textAlign: "center",
    justifyContent: "center",
  }
});