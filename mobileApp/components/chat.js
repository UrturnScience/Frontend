import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import Rhino from '../assets/roomierhino.png'
class Chat extends React.Component {
  state = {
    messages: [],
  }
 
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'hey whats up, i\'m roomie rhino',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Roomie Rhino',
            avatar: Rhino,
          },
        },
      ],
    })
  }
 
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }
 
  render() {
    return (
      <View style={{flex:1,alignContent:'center',justifyContent:'center' }}>
          
    <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      </View>
      
    )
  }
}
export default Chat;
