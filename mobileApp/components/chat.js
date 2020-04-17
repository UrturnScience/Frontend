
import { StyleSheet, Text, View, RecyclerViewBackedScrollViewComponent } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import React, { useState, useEffect } from "react";
import Rhino from '../assets/roomierhino.png'




class Chat extends React.Component {
  constructor(props)
  {
    super(props);
  
    this.state={
      messages:[
        {
          _id:1,
          text: 'cool',
          user:{
            _id:2
          }
        }
      ],
      data: this.props.messages,
      
    }
    this.onSend= this.props.onSend;
    console.log("this is data:"+this.state.data)
    this.onLoad.bind(this);
  }
  
  
  render() {
    return (  
      
    <GiftedChat
        messages={this.state.messages}
        onSend={(message)=>{
          this.onSend(message[0].text)
        }}
        user={{
          _id:1,
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
    console.log("MMSGGGG:"+msg.data)
    console.log(typeof(this.state.messages))
    this.setState((previousState)=>
      {
        return{
          messages:GiftedChat.append(previousState.messages,parse)
        }
      })
  }
  componentDidMount()
  {
    this.state.data.map((msg)=>{
      
      this.onLoad(msg)
      console.log("this msgs"+this.state.messages)
    })
  }
  
}
export default Chat;

// export default Chat;


// import React, { useState } from "react";
// import { View, Text, TextInput, Button, FlatList,StyleSheet } from "react-native";


// function MessageItem({ message }) {
//   return (
//     <View>
//       <Text>{message.senderId} sent "{message.data}"</Text>
//     </View>
//   );
// }

// function Chat({ onSend, messages }) {
//   const [message, setMessage] = useState("");

//   return (
//     <View >
//       <FlatList
//         data={messages}
//         renderItem={({ item }) => <MessageItem message={item}></MessageItem>}
//         keyExtractor={item => item._id}
//       ></FlatList>
      
//       <TextInput
//         style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
//         onChangeText={text => setMessage(text)}
//         value={message}
//       ></TextInput>
//       <Button
//         title="send"
//         onPress={() => {
//           onSend(message);
//         }}
//       ></Button>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   parentStyle:{
//     flex:1,
//     justifyContent : 'center',
//     alignItems: 'center'
//   },
// })

// export default Chat;