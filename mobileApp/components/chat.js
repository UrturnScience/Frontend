
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
    _id: msg.giftedId || msg._id,
    mongoId: msg._id,
    text: msg.data,
    createdAt: msg.createdAt || Date.now(),
    sent: true,
    user:{
      _id: msg.senderId,
      name: msg.senderId,
    }
  }
}

const formatMessage = msg => {
  msg.pending = true;
  msg.createdAt = Date.parse(msg.createdAt);
  return msg;
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

      if(websocket.getWebSocket()) {
        websocket.getWebSocket().onmessage = msg =>{
          const data = parseMsg(JSON.parse(msg.data));

          if (data.user._id == this.context.user._id) {
            this.state.messages.find(m => {
              if (m.pending == true && m._id === data._id) {
                m.pending = false;
                m.sent = true;

                // Used to force a re-render of the chat component to reflect changes (doesn't always work on low latency)
                this.setState({ state: this.state });
              }
            });
          } else {
            this.setState(previousState => ({
              messages: GiftedChat.append(this.state.messages, data)
            }));
          }
        }
      }
    }).catch(e => {
      console.log(e);
    });
  }

  onSend(messages) {
    messages = messages.map(formatMessage);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let data = {
      message: messages[0].text,
      giftedId: messages[0]._id,
    };

    websocket.getWebSocket().send(JSON.stringify(data));
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
