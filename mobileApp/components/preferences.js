import React, { Component } from 'react';
import {Alert, TouchableOpacity,ImageBackground, StyleSheet,View,Text, Image } from 'react-native';
import { Button,Item} from 'native-base';
import DraggableFlatList from "react-native-draggable-flatlist";
import Dialog from 'react-native-dialog';

// function to add a horizontal black line on the screen to separate areas of the app
function Separator() {
  return <View style={styles.separator} />;
}


class Preferences extends Component {

  constructor(props){
    
    super(props);
    
    //the initial state that the screen is loaded with
    this.state = {
      // chores: [], //This is where we would call the backend to fill this array with strings for chore titles
      // chores: ["Dishes", "Vaccum", "Take out Trash"] <--- An example hard-coded array for chores
      chores: ["Dishes", "Vaccum", "Take out Trash"],
      isAddChorePopupVisible: false,
    }

    this.addChore = this.addChore.bind(this)
  }

  // adds a new chore to the list on the screen and closes the popup window
  addChore(choreValue){
    console.log("choreValue: ", choreValue)
    this.setState(prevState => ({
      chores: [...prevState.chores, choreValue]
    }))
    this.setState({isAddChorePopupVisible: false})
  }

  // shows the popup window to add a new chore
  showAddChoreDialogPopup = () => {
    this.setState({ isAddChorePopupVisible: true});
  }

  // hides the popup window to add a new chore
  hideAddChoreDialogPopup = () => {
    this.setState({ isAddChorePopupVisible: false});
  }

  // renders the individual chore draggable items in the screen
  renderItem = ({ item, drag, isActive }) => {
    return (
      <TouchableOpacity
        style={{
          height: 50,
          backgroundColor: isActive ? "lightblue" : "grey",
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
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    
    // let mappedChores = this.state.chores.map(function(val, index) {
    //   return {key: index, val: val};
    // })
    
    return (
      
      <View style={{ marginTop:40, flex: 1 }}>
          <View style={styles.parentStyle}>
            <Text style={{fontWeight:'bold',fontSize:40}}>Preferences</Text>
          </View>

          <Separator />
          
        <DraggableFlatList
          data={this.state.chores}
          // data={mappedChores}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          onDragEnd={({data}) => this.setState({ data })}
          autoscrollThreshold={50}
        />

        <View style={styles.buttonView}>
          <Button style={{ backgroundColor: 'lightblue'}} onPress={this.showAddChoreDialogPopup}>
            <Text style={{padding: 10}}>ADD CHORE</Text>
          </Button>
        </View>

        <Dialog.Container visible={this.state.isAddChorePopupVisible}>
          <Dialog.Title>Add Chore</Dialog.Title>
          <Dialog.Button label="Cancel" onPress={this.hideAddChoreDialogPopup}/>
          <Dialog.Description>Enter the name of the chore you would like to add</Dialog.Description>
          <Dialog.Input placeholder="Chore Name" onSubmitEditing={(newChore) => this.addChore(newChore["nativeEvent"]["text"])}></Dialog.Input>
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