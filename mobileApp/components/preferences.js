import React, { Component } from 'react';
import {Alert, TouchableOpacity,ImageBackground, StyleSheet,View,Text, Image } from 'react-native';
import { Button,Item} from 'native-base';
import DraggableFlatList from "react-native-draggable-flatlist";
import Dialog from 'react-native-dialog';


function Separator() {
  return <View style={styles.separator} />;
}


class Preferences extends Component {

  choreList = ["Dishes", "Vaccum", "Take Out Trash", "Get Eli Started On Frontend"];

  listItems = this.choreList.map((chore,index) => ({
    key: `Chore ${index}`,
    label: chore,
    backgroundColor:'grey',  
  }))
  
  state = {
    data: this.listItems,
    isAddChorePopupVisible: false
  };

  addChoreDialogPopup = () => {
    this.setState({ isAddChorePopupVisible: true});
  }

  cancelAddingChore = () => {
    this.setState({ isAddChorePopupVisible: false});
  }

  addChore = (newChore) => {
    this.listItems.push(newChore["nativeEvent"]["text"], this.listItems.length+1)
    console.log("this.listItems: ", this.listItems)
    this.setState({ isAddChorePopupVisible: false})
  }

  renderItem = ({ item, index, drag, isActive }) => {
    return (
      <TouchableOpacity
        style={{
          height: 50,
          backgroundColor: isActive ? "lightblue" : item.backgroundColor,
          alignItems: "center",
          justifyContent: "center"
        }}
        onLongPress={drag}
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
            <Text style={{fontWeight:'bold',fontSize:40}}>Preferences</Text>
          </View>

          <Separator />
          
        <DraggableFlatList
          data={this.listItems}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          onDragEnd={({data}) => this.setState({ data })}
          autoscrollThreshold={50}
        />

        <View style={styles.buttonView}>
          <Button style={{ backgroundColor: 'lightblue'}} onPress={this.addChoreDialogPopup}>
            <Text style={{padding: 10}}>ADD CHORE</Text>
          </Button>
        </View>

        <Dialog.Container visible={this.state.isAddChorePopupVisible}>
          <Dialog.Title>Add Chore</Dialog.Title>
          <Dialog.Button label="Cancel" onPress={this.cancelAddingChore}/>
          <Dialog.Description>Enter the name of the chore you would like to add</Dialog.Description>
          <Dialog.Input placeholder="Chore Name" onSubmitEditing={(newChore) => this.addChore(newChore)}></Dialog.Input>
        </Dialog.Container>

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
  separator: {
    marginVertical: 8,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    padding: 10
  },
})

export default Preferences;