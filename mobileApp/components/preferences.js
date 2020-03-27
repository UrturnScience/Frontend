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
      isSubmitPrefsPopupVisible: false,
    }

    this.addChore = this.addChore.bind(this)
  }

  // adds a new chore to the list on the screen and closes the popup window
  addChore(choreValue){
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

  // shows the popup window to submit preferences
  showSubmitPrefsPopup = () => {
    this.setState({ isSubmitPrefsPopupVisible: true})
  }

  // hides the popup window to submit preferences
  hideSubmitPrefsPopup = () => {
    this.setState({ isSubmitPrefsPopupVisible: false})
  }

  // updates the order of the chores
  updateChoreRanking = (data) => {
    updatedChoreArray = []
    for (let choreObject of data) {
      updatedChoreArray.push(choreObject["label"])
    }
    this.setState(({chores: updatedChoreArray}))
  }

  // sends order of chore list to the backend to set user chore preferences
  submitChorePrefs = () => {
    // fill in function to make backend POST call
    this.setState({isSubmitPrefsPopupVisible: false})
  }

  // renders the individual chore draggable items in the screen
  renderItem = ({ item, index, drag, isActive }) => {
    return (
      <TouchableOpacity
        style={{
          height: 50,
          backgroundColor: isActive ? "lightblue": item.backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          borderColor: "black",
          borderBottomWidth: 1
        }}
        onLongPress={drag}
      >
        <Text
          style={{
            color: "black",
            fontSize: 22
          }}
        >
          {item.label}
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

        <Text style={{fontSize: 20, fontStyle: "italic", padding: 5, fontWeight: "500"}}>Favorite Chore</Text>

        <DraggableFlatList
          data={this.state.chores.map((choreTitle, index) => ({
            key: `item-${choreTitle}`,
            label: choreTitle,
            backgroundColor: `grey`
          }))}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          onDragEnd={({data}) => this.updateChoreRanking(data)}
          autoscrollThreshold={50}
        />

        <Text style={{fontSize: 20, fontStyle: "italic", padding: 5, fontWeight: "500"}}>Least Favorite Chore</Text>

        <Separator />
        <View style={{padding: 10}}>
          <Text style={styles.helperText}>press and hold a chore to drag and drop it in the list</Text>
        </View>

        <View style={styles.buttonsView}>
          <Button style={{ backgroundColor: 'lightblue'}} onPress={this.showAddChoreDialogPopup}>
            <Text style={{padding: 10}}>ADD CHORE</Text>
          </Button>

          <Button style={{ backgroundColor: '#90EE90'}} onPress={this.showSubmitPrefsPopup}>
            <Text style={{padding: 10}}>SUBMIT</Text>
          </Button>
        </View>

        <Dialog.Container visible={this.state.isAddChorePopupVisible}>
          <Dialog.Title>Add Chore</Dialog.Title>
          <Dialog.Button label="Cancel" onPress={this.hideAddChoreDialogPopup}/>
          <Dialog.Description>Enter the name of the chore you would like to add</Dialog.Description>
          <Dialog.Input placeholder="Chore Name" onSubmitEditing={(newChore) => this.addChore(newChore["nativeEvent"]["text"])}></Dialog.Input>
        </Dialog.Container>

        <Dialog.Container visible={this.state.isSubmitPrefsPopupVisible}>
          <Dialog.Title>Submit Preferences</Dialog.Title>
          <Dialog.Description>Are you sure you want to submit your chore preferences?</Dialog.Description>
          <Dialog.Button label="Cancel" color="red" onPress={this.hideSubmitPrefsPopup}/>
          <Dialog.Button label="Submit" onPress={this.submitChorePrefs}/>
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
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignSelf: 'flex-end',
    padding: 10
  },
  helperText: {
    fontSize: 15,
    fontStyle: "italic",
  }
})

export default Preferences;