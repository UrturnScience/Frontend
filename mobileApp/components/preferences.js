import React, { Component } from 'react';
import {TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Form, Input, Label, Item, CheckBox } from 'native-base';
import DraggableFlatList from "react-native-draggable-flatlist";
import Dialog from 'react-native-dialog';
import Modal from 'react-native-modal';

// Required for connecting to backend
import { BACKEND_URL } from 'react-native-dotenv';
import Axios from 'axios';
import { DbContext } from '../context';
import { FlatList } from 'react-native-gesture-handler';


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
      viewNewChore: false,
      newChoreName: "",
      newChoreRecurring: false,
    }
  }

  static contextType = DbContext;

  getPreferences(user) {
    this._preferenceRequest = Axios.get(`${BACKEND_URL}/preference/upcoming/${user._id}`).then(res => {
      let choreCalls = res.data.preferences.map(p => Axios.get(`${BACKEND_URL}/chore/${p.choreId}`));

      Promise.all(choreCalls).then(results => {
        for (let i = 0; i < results.length; i++) {
          res.data.preferences[i].chore = results[i].data.chore;
        }
        res.data.preferences.sort((a, b) => (a.weight < b.weight) ? -1 : 1);
        this.setState({
          preferences: res.data.preferences
        });
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

  submitChore = () => {
    Axios.post(`${BACKEND_URL}/chore/create`, {
      roomId: this.context.room,
      name: this.state.newChoreName,
      time: 1,
      recurring: this.state.newChoreRecurring,
    }).then(() => {
      this.toggleModal();
      this.getPreferences(this.context.user);
    }).catch(e => {
      console.log(e);
    });
  }

  toggleModal = () => {
    this.setState({ newChoreName: "" });
    this.setState({ newChoreRecurring: false });
    this.setState({ viewNewChore: !this.state.viewNewChore });
  }

  toggleModalCheck = () => {
    this.setState({ newChoreRecurring: !this.state.newChoreRecurring });
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
  renderPreferenceItem = ({ item, index, drag, isActive }) => {
    return (
      <TouchableOpacity
        style={{
          height: 50,
          backgroundColor: isActive ? "#3284f7": item.backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          borderTopLeftRadius: 2,
          borderBottomLeftRadius: 2,
          flex: 1,
          marginTop: 3,
          marginBottom: 3,
          elevation: isActive ? 20 : 2,
          shadowColor: 'darkgrey',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.6,
          shadowRadius: 2,
        }}
        onLongPress={drag}
      >
        <Text style={{
            color: "black",
            fontSize: 22,
        }}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  renderIndexItem = ({_, index}) => {
    return (
      <View style={styles.rankingItem}>
        <Text style={{fontSize: 22}}>{index + 1}.</Text>
      </View>
    )
  }

  render() {
    if (this.state.preferences === null) {
      return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Text>Loading preferences...</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={{fontWeight:'bold',fontSize:40}}>Chore Draft</Text>
            </View>
            <Separator />
            <View style={styles.listContainer}>
              <View style={styles.flatList}>
                <FlatList 
                  data={this.state.preferences}
                  renderItem={this.renderIndexItem}
                  keyExtractor={(item, index) => `item-index-${index}-rank`}
                  scrollEnabled={false}
                />
              </View>
              <View style={styles.draggableFlatList}>
                <DraggableFlatList
                  data={this.state.preferences.map(preference => ({
                    key: `item-${preference.chore.name}`,
                    label: preference.chore.name,
                    backgroundColor: `white`,
                  }))}
                  renderItem={this.renderPreferenceItem}
                  keyExtractor={(item, index) => `draggable-item-${item.key}`}
                  onDragEnd={({data}) => this.updatePreferenceRanking(data)}
                  autoscrollThreshold={50}
                  scrollEnabled={false}
                />
              </View>
            </View>
          </View>
          <View style={styles.bottom}>
            <View style={{padding: 10, alignItems: "center"}}>
              <Text style={styles.helperText}>Press and hold a chore to drag and drop it in the list</Text>
            </View>
            <View style={styles.buttons}>
              <Button
                style={styles.refreshButton}
                onPress={() => {
                  this.getPreferences(this.context.user);
                }}
              >
                <Ionicons name="ios-refresh" size={25} color="grey" />
              </Button>
              <Button style={styles.newChoreButton} onPress={this.toggleModal}>
                <Text style={{ color: "white" }}>New chore +</Text>
              </Button>
              <Button style={styles.submitButton} onPress={this.showSubmitPrefsPopup}>
                <Text style={{ color: "white" }}>Submit</Text>
              </Button>
            </View>
          </View>
          <Dialog.Container visible={this.state.isSubmitPrefsPopupVisible}>
            <Dialog.Title>Submit Preferences</Dialog.Title>
            <Dialog.Description>Are you sure you want to submit your chore preferences?</Dialog.Description>
            <Dialog.Button label="Cancel" color="grey" onPress={this.hideSubmitPrefsPopup}/>
            <Dialog.Button label="Submit" color="#3284f7" onPress={this.submitPreferences}/>
          </Dialog.Container>

          <Modal
            isVisible={this.state.viewNewChore}
            style={styles.modal}
          >
            <View style={styles.newChoreContainer}>
              <View>
                <Text style={{fontSize: 34, marginTop: 20, }}>Create a new chore</Text>
              </View>
              <View style={styles.newChoreForm}>
                <Form >
                  <Item floatingLabel>
                    <Label>Name</Label>
                    <Input
                      onChangeText = {(newChoreName) => this.setState({newChoreName})}
                      autoCorrect = {true}
                    />
                  </Item>
                  <View style={{ flexDirection: "row", justifyContent: "center", alignViews: "center", paddingTop: 20 }}>
                    <CheckBox
                      checked={this.state.newChoreRecurring}
                      onPress={this.toggleModalCheck}
                      style={{ marginRight: 20 }}
                    />
                    <Label>Occurs every week?</Label>
                  </View>
                </Form>
              </View>
              <View style={styles.modalButtons}>
                <Button onPress={this.toggleModal} style={styles.cancelNewChoreButton}>
                  <Text style={{ color: "grey"}}t>Cancel</Text>
                </Button>
                <Button onPress={this.submitChore} style={styles.submitNewChoreButton}>
                  <Text style={{ color: "white"}}t>Create</Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%"
  },
  content: {
    paddingTop: 40,
    // height: "70%",
    flex: 1,
  },
  bottom: {
    flexDirection: 'column',
    borderTopColor: 'black',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    padding: 10,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    flexDirection: "row",
    flex: 1,
  },
  flatList: {
    width: "10%",
  },
  draggableFlatList: {
    width: "90%",
  },
  rankingItem: {
    height: 56,
    justifyContent: "center",
    paddingLeft: 15,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  newChoreButton: {
    backgroundColor: 'tomato',
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: '#3284f7',
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  refreshButton: {
    backgroundColor: 'lightgrey',
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  helperText: {
    fontSize: 15,
    fontStyle: "italic",
    color: "grey"
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  newChoreContainer: {
    backgroundColor: "white",
    padding: 15,
    paddingBottom: 200,
    // display: "flex",
    // flexDirection: "row",
    alignItems: "center",
  },
  newChoreForm: {
    width: "60%",
    marginBottom: 25,
    // justifyContent: "center"
  },
  modalButtons: {
    marginTop: 20,
    // display: "flex",
    width: "70%",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  cancelNewChoreButton: {
    // justifyContent: "center",
    justifyContent: "center",
    width: "40%",
    backgroundColor: "lightgrey",
  },
  submitNewChoreButton: {
    justifyContent: "center",
    width: "40%",
    backgroundColor: "#3284f7",
  }
})

export default Preferences;
