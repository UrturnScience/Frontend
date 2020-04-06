import React, { Component } from 'react';
import {TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'native-base';
import DraggableFlatList from "react-native-draggable-flatlist";
import Dialog from 'react-native-dialog';

// Required for connecting to backend
import { BACKEND_URL } from 'react-native-dotenv';
import Axios from 'axios';
import { DbContext } from '../context';


// function to add a horizontal black line on the screen to separate areas of the app
function Separator() {
  return <View style={styles.separator} />;
}


class Preferences extends Component {

  constructor(props){
    
    super(props);

    this._preferenceRequest = null
    
    //the initial state that the screen is loaded with
    this.state = {
      preferences: null,
      isSubmitPrefsPopupVisible: false,
    }
  }

  static contextType = DbContext;

  getPreferences(user) {
    console.log("PREFERENCE_REQUEST before:");
    console.log(this._preferenceRequest);
    this._preferenceRequest = Axios.get(`${BACKEND_URL}/preference/user/${user._id}`).then(res => {
      let choreCalls = res.data.preferences.map(p => Axios.get(`${BACKEND_URL}/chore/${p.choreId}`));

      Promise.all(choreCalls).then(results => {
        for (let i = 0; i < results.length; i++) {
          res.data.preferences[i].chore = results[i].data.chore;
        }
        res.data.preferences.sort((a, b) => (a.weight < b.weight) ? -1 : 1);
        this.setState({
          preferences: res.data.preferences
        });
        console.log("PREFERENCE_REQUEST after:");
        console.log(this._preferenceRequest);
        this._preferenceRequest = null;
      });
    });
  }

  componentDidMount() {
    this.getPreferences(this.context.user);
  }

  componentWillUnmount() {
    if (this._preferenceRequest) {
      this._preferenceRequest.cancel();
    }
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
  updatePreferenceRanking = (listComponents) => {
    let newPreferences = [];
    for (let i = 0; i < listComponents.length; i++) {
      for (let j = 0; j < this.state.preferences.length; j++) {
        if (!this.state.preferences[j].chore.name.localeCompare(listComponents[i]["label"])) {
          newPreferences.push(this.state.preferences[j]);
        }
      }
    }
    this.setState({
      preferences: newPreferences
    });
  }

  // sends order of chore list to the backend to set user chore preferences
  submitPreferences = () => {
    Axios.put(`${BACKEND_URL}/preference/update/${this.context.user._id}`, {
      preferenceIds: this.state.preferences.map(c => c._id)
    }).then(
      res => {
        this.setState({isSubmitPrefsPopupVisible: false})
      }
    ).catch(
      e => {
        console.error(e);
      }
    )
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
    if (this.state.preferences === null) {
      return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Text>Loading preferences...</Text>
        </View>
      )
    } else {
      return (
        <View style={{ marginTop:40, flex: 1 }}>
            <View style={styles.parentStyle}>
              <Text style={{fontWeight:'bold',fontSize:40}}>Preferences</Text>
            </View>
  
            <Separator />
  
          <Text style={{fontSize: 20, fontStyle: "italic", padding: 5, fontWeight: "500"}}>Favorite Chore</Text>
  
          <DraggableFlatList
            data={this.state.preferences.map(preference => ({
              key: `item-${preference.chore.name}`,
              label: preference.chore.name,
              backgroundColor: `#D4D4D4`
            }))}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => `draggable-item-${item.key}`}
            onDragEnd={({data}) => this.updatePreferenceRanking(data)}
            autoscrollThreshold={50}
          />
  
          <Text style={{fontSize: 20, fontStyle: "italic", padding: 5, fontWeight: "500"}}>Least Favorite Chore</Text>
  
          <Separator />
          <View style={{padding: 10}}>
            <Text style={styles.helperText}>Press and hold a chore to drag and drop it in the list</Text>
          </View>
  
          <View style={styles.buttonsView}> 
            <Button
              style={[styles.refreshButton, styles.active ]}
              onPress={() => {
                this.getPreferences(this.context.user);
                console.log();
              }}
              // disabled={this._preferenceRequest == null}
            >
              <Ionicons name="ios-refresh" size={25} color="grey" />
            </Button>
            <Button style={styles.submitButton} onPress={this.showSubmitPrefsPopup}>
              <Text style={{padding: 10}}>SUBMIT</Text>
            </Button>
          </View>
  
          <Dialog.Container visible={this.state.isSubmitPrefsPopupVisible}>
            <Dialog.Title>Submit Preferences</Dialog.Title>
            <Dialog.Description>Are you sure you want to submit your chore preferences?</Dialog.Description>
            <Dialog.Button label="Cancel" color="red" onPress={this.hideSubmitPrefsPopup}/>
            <Dialog.Button label="Submit" onPress={this.submitPreferences}/>
          </Dialog.Container>
  
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  parentStyle:{
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
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#90EE90',
    width: "30%",
    justifyContent: "center"
  },
  refreshButton: {
    backgroundColor: 'lightblue',
    width: "25%",
    justifyContent: "center",
    padding: 10
  },
  helperText: {
    fontSize: 15,
    fontStyle: "italic",
  }
})

export default Preferences;