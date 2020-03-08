import React, { Component } from 'react';
import {Alert, TouchableOpacity,ImageBackground, StyleSheet,View,Text, Image } from 'react-native';
import { Button,Item } from 'native-base';
import DraggableFlatList from "react-native-draggable-flatlist";


const exampleData = [...Array(20)].map((d, index) => ({
    key: `item-${index}`, // For example only -- don't use index as your key!
    label: index,
    backgroundColor: 'red'
  }));
const list = ["dishes", "vaccum", "take trash out", "Get Eli started on frontend"]
const listItems = list.map((chore,index)=> ({
    key: `item-${index}`,
    label: chore,
    backgroundColor:'grey',
    
    
}))
  


  class Preferences extends Component {
    state = {
      data: listItems
    };
  
    renderItem = ({ item, index, drag, isActive }) => {
      return (
        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: isActive ? "blue" : item.backgroundColor,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPressIn={drag}
        >
          <Text
            style={{
              color: "black",
              fontSize: 22
            }}
          >
            {item.key}, {item.label}
          </Text>
        </TouchableOpacity>
      );
    };
  
    render() {
      return (
        
        <View style={{ marginTop:40, flex: 1 }}>
            <View style={styles.parentStyle}>
            <Text style={{fontweight:'bold',fontSize:'40'}}>Preferences Page</Text>
            </View>
            
          <DraggableFlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => `draggable-item-${item.key}`}
            onDragEnd={({data}) => this.setState({ data })}
          />
        {this.state.data.map((value,index)=>{
            return(
                <Text>{value.label},{index}</Text>
            )
            
        })}
        </View>
        
        
      );
    }
  }
  const styles = StyleSheet.create({
    parentStyle:
    {
        flex:.10,
        justifyContent : 'center',
        alignItems: 'center'
    },
    
  })
  export default Preferences;