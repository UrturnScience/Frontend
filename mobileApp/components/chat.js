import {
  StyleSheet,
  Text,
  View,
  RecyclerViewBackedScrollViewComponent,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import React, { useState, useEffect } from "react";
import Rhino from "../assets/roomierhino.png";
import { DbContext } from "../context";

// Required for websocket functionality
import {
  getRoomMessages,
  getUserRoom,
  joinRoom,
  createAndJoinRoom,
} from "../src/request";
import * as websocket from "../src/websocket";

const parseMsg = (msg) => {
  return {
    _id: msg.giftedId || msg._id,
    mongoId: msg._id,
    text: msg.data,
    createdAt: msg.createdAt || Date.now(),
    sent: true,
    system: msg.system,
    user: {
      _id: msg.senderId,
      name: msg.senderId,
    },
  };
};

const formatMessage = (msg) => {
  msg.pending = true;
  msg.createdAt = Date.parse(msg.createdAt);
  return msg;
};

class Chat extends React.Component {
  static contextType = DbContext;

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    getRoomMessages(this.context.room)
      .then((resMessages) => {
        this.setState({
          messages: resMessages.map(parseMsg).reverse(),
        });

        if (websocket.getWebSocket()) {
          websocket.getWebSocket().onmessage = (msg) => {
            const data = parseMsg(JSON.parse(msg.data));

            console.log("RECEIVED MESSAGE FROM WEBSOCKET", data);

            if (data.user._id == this.context.user._id) {
              const sentIndex = this.state.messages.findIndex(
                (m) => m.pending == true && m._id === data._id
              );
              let messages = [...this.state.messages];
              let sentMessage = {
                ...messages[sentIndex],
                pending: false,
                sent: true,
              };
              messages[sentIndex] = sentMessage;
              this.setState({ messages });
            } else {
              this.setState((previousState) => ({
                messages: GiftedChat.append(this.state.messages, data),
              }));
            }
          };
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  onSend(messages) {
    messages = messages.map(formatMessage);
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let data = {
      message: messages[0].text,
      giftedId: messages[0]._id,
    };

    websocket.getWebSocket().send(JSON.stringify(data));
  }

  renderFooter(props) {
    if (this.state.messages.length == 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyMessagesText}>No messages have been sent!</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={{ backgroundColor: "white", flex: 1, paddingTop: 20 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(message) => {
            this.onSend(message);
          }}
          user={{
            _id: this.context.user._id,
          }}
          renderChatFooter={this.renderFooter.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%",
  },
  emptyMessagesText: {
    color: "grey",
  }
});

export default Chat;
