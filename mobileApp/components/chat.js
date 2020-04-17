
import { StyleSheet, Text, View, RecyclerViewBackedScrollViewComponent } from 'react-native';
import { GiftedChat,Bubble  } from 'react-native-gifted-chat'
import React, { useState, useEffect } from "react";
import Rhino from '../assets/roomierhino.png'
import { DbContext } from '../context';

// Required for websocket functionality
import {
  getRoomMessages,
  getUserRoom,
  joinRoom,
  createAndJoinRoom
} from "../src/request";
import * as websocket from "../src/websocket";


const parseMsg = msg => {
  return {
    _id: msg._id,
    text: msg.data,
    createdAt: Date.now(),
    user:{
      _id: msg.senderId,
      name: msg.senderId,
    }
  }
}

class Chat extends React.Component {
  static contextType = DbContext;

  constructor(props)
  {
    super(props);
  
    this.state = {
      messages:[]
    }
  }

  componentDidMount()
  {
    getRoomMessages(this.context.room).then(resMessages => {
      this.setState({
        messages: resMessages.map(parseMsg).reverse()
      });

      if(websocket.getWebSocket())
      {
        websocket.getWebSocket().onmessage = msg =>{
          const data = parseMsg(JSON.parse(msg.data));
          console.log("MESSAGE:");
          console.log(data);
          this.setState(previousState => ({
            messages: GiftedChat.append(this.state.messages, data)
          }));
        }
      }
    }).catch(e => {
      console.log(e);
    });
  }

  onSend(messages) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    websocket.getWebSocket().send(messages[0].text);
  }

  render() {
    return (
      <View style={{ backgroundColor: "white", flex: 1, paddingTop: 20 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(message)=>{
            this.onSend(message)
          }}
          user={{
            _id: this.context.user._id
          }}
        />
      </View>
    );
  }
}
export default Chat;
