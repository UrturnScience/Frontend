
import { StyleSheet, Text, View, RecyclerViewBackedScrollViewComponent } from 'react-native';
import { GiftedChat,Bubble  } from 'react-native-gifted-chat'
import React, { useState, useEffect } from "react";
import Rhino from '../assets/roomierhino.png'




class Chat extends React.Component {
  constructor(props)
  {
    super(props);
  
    this.state={
      messages:[
     
      ],
      userId:"",
      data: this.props.messages,
      
    }
    this.onSend= this.props.onSend;
    console.log("this is data:"+JSON.stringify(this.state.data))
    this.onLoad.bind(this)
    this.addMsg.bind(this)

  }
  
  addMsg(msg)
  {
    this.onSend(msg[0].text)
    console.log("THIS IS MESSAGE"+JSON.stringify(msg))
    
    this.setState((previousState)=>{
      return{
        messages:GiftedChat.append(previousState.messages,msg)
      }
    })

  }
  render() {
    
    return (  
      
    <GiftedChat
        messages={this.state.messages}
        onSend={(message)=>{
          this.addMsg(message)
        }}
      
 
      />
    )
  }

  onLoad(msg)
  {
    const parse ={
      _id: msg._id,
      text: msg.data,
      createdAt: Date.now(),
      user:{
        _id: msg.senderId,
        name: msg.senderId,
      }
    }
    this.setState((previousState)=>
      {
        return{
          messages:GiftedChat.append(previousState.messages,parse)
        }
        
      }) 
      
  }
  
  componentDidMount()
  {
    console.log("ONCE")
    this.state.data.map((msg)=>{
      this.onLoad(msg)
    })
  }
  
  
}
export default Chat;

