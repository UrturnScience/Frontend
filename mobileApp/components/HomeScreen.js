import React, { Component } from 'react';
import {StyleSheet, View, Text, ScrollView, RefreshControl, Picker } from 'react-native';
import { ListItem, CheckBox, Body, CardItem, Card, Form, Input, Label, Item, Button } from 'native-base';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { Updates } from 'expo';
import { onSessionWasInterrupted, getCurrentFrame } from 'expo/build/AR';
import { fetchUpdateAsync } from 'expo/build/Updates/Updates';
import { MaterialCommunityIcons } from "@expo/vector-icons"
// Required for connecting to backend
import { BACKEND_URL } from '../config';
import Axios from 'axios';
import { DbContext } from '../context';
import { TouchableOpacity } from 'react-native-gesture-handler';

// function to add a horizontal black line on the screen to separate areas of the app
function Separator() {
	return <View style={styles.separator} />;
}

class HomeScreen extends Component {

	constructor(props){
	
		super(props);

		this._assignmentsRequest = null
		
		//the initial state that the screen is loaded with
		this.state = {
			assignments: null,
      refreshing: false,
      viewReportModal: false,
      assignmentToReport: "",
      reportReason: "",
      roomAssignments: null,
		}
	}

	static contextType = DbContext

	getAssignments(user) {
		this._assignmentsRequest = Axios.get(`${BACKEND_URL}/assignment/active/${user._id}`).then(response => {
      console.log(response.data.assignments);

			let chores = response.data.assignments.map(a => Axios.get(`${BACKEND_URL}/chore/${a.choreId}`));

			Promise.all(chores).then(results => {
				for (let i = 0; i < results.length; i++) {
					response.data.assignments[i].chore = results[i].data.chore;
				}
				this.setState({
					assignments: response.data.assignments
				})
				this._assignmentsRequest = null
			});
    })

		this.setState({refreshing: false});
  }
  
  getRoomAssignments(room) {
    Axios.get(`${BACKEND_URL}/assignment/room/${room}`).then((response) => {
      let chores = response.data.assignments.map(a => Axios.get(`${BACKEND_URL}/chore/${a.choreId}`));

			Promise.all(chores).then(results => {
				for (let i = 0; i < results.length; i++) {
					response.data.assignments[i].chore = results[i].data.chore;
				}
				this.setState({
					roomAssignments: response.data.assignments
				});
			});
    });
  }

	componentDidMount() {
    this.getAssignments(this.context.user);
    this.getRoomAssignments(this.context.room);
	}

	// toggles the chore as completed/not completed
	toggleChoreCompletion(responseObj, assID){
		this.setState(prevState => ({
			assignments: prevState.assignments.map(
				a => a._id === assID? {...a, successful: !a.successful}: a
			)
		}))
		Axios.put(`${BACKEND_URL}/assignment/successful/${assID}`)
  }
  
  toggleModal() {
    this.setState({ assignmentToReport: "" });
    this.setState({ reportReason: "" });
    this.setState({ viewReportModal: !this.state.viewReportModal });
  }

  submitReport() {
    console.log("SUBMIT REPORT");
    Axios.post(`${BACKEND_URL}/assignment/report/${this.state.assignmentToReport}`, {
      status: this.state.reportReason
    }).then(() => {
      this.toggleModal();
    }).catch(e => {
      console.log(e);
    });
  }

	//sets the refreshing spinner while data is being retrieved from the backend
	onRefresh(){
		this.setState({refreshing: true});
		this.getAssignments(this.context.user)
	}

	render(){
		if (this.state.assignments == null || this.state.roomAssignments == null) {
			return (
			  <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
				<Text>Loading assignments...</Text>
			  </View>
			)
		} 
		else if (this.state.assignments.length == 0){
			return (
				<View style={{ marginTop:40, flex: 1 }}>
					
					<View style={styles.parentStyle}>
						<Text style={{fontWeight:'bold',fontSize:36}}>Home</Text>
					</View>

					<Separator />
					<ScrollView 
					refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)}/>}
					contentContainerStyle={{flex: 1, justifyContent: "center", alignItems: "center"}}>
						<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
							<Text style={{ color: "grey", fontSize: 16 }}>You have no chores assigned this week!</Text>
              <TouchableOpacity style={styles.remindButton} onPress={this.toggleModal.bind(this)}>
                <MaterialCommunityIcons name='chat-alert' size={20} color='lightgrey' />
                <Text style={{ color: "grey", paddingLeft: 3, paddingBottom: 3, fontSize: 10 }}>Report</Text>
              </TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			)
		}
		else {
			return(
				<View style={{ marginTop:40, flex: 1 }}>
					
					<View style={styles.parentStyle}>
						<Text style={{fontWeight:'bold',fontSize:36}}>Home</Text>
					</View>

					<Separator />
					
					<ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)}/>}>
						<Card>
							
							<CardItem header style={styles.taskListHeader}>
								<Text style={styles.taskListHeaderText}>To-do this week</Text>
                <TouchableOpacity style={styles.remindButton} onPress={this.toggleModal.bind(this)}>
                  <MaterialCommunityIcons name='chat-alert' size={20} color='lightgrey' />
                  <Text style={{ color: "grey", paddingLeft: 3, paddingBottom: 3, fontSize: 10 }}>Report</Text>
                </TouchableOpacity>
							</CardItem>

							{
								this.state.assignments.map(assignment => (
									<ListItem key={assignment._id}>
										<CheckBox color="#3284f7" checked={assignment.successful} onPress={(responseObj) => this.toggleChoreCompletion(responseObj, assignment._id)}/>
										<Body style={{padding: 10}}>
											<Text>{assignment.chore.name}</Text>
										</Body>
									</ListItem>
								))
							}
						</Card>
					</ScrollView>

          {/* Modal that handles creating a report */}
          <Modal
            isVisible={this.state.viewReportModal}
            style={styles.modal}
          >
            <View style={styles.reportContainer}>
              <View style={{ justifyContent: "center" }}>
                <Text style={{fontSize: 28, marginTop: 20 }}>Something wrong?</Text>
                <Text style={{fontSize: 14, marginTop: 10 }}>Let the bot take care of the nagging</Text>
              </View>
              <View style={styles.reportForm}>
                <Dropdown 
                  label="Select assignment"
                  data={
                    this.state.roomAssignments
                      .filter(ra => ra.userId != this.context.user._id)
                      .map(ra => {
                        return {
                          label: ra.chore.name,
                          value: ra._id
                        }
                      })
                  }
                  onChangeText={(val) => this.setState({ assignmentToReport: val })}
                />
                <Dropdown 
                  label="Select reason"
                  data={[
                    {
                      label: "Not complete yet",
                      value: "late"
                    },
                    {
                      label: "Not done correctly",
                      value: "wrong",
                    }
                  ]}
                  onChangeText={(val) => this.setState({ reportReason: val })}
                />
              </View>
              <View style={styles.modalButtons}>
                <Button onPress={this.toggleModal.bind(this)} style={styles.cancelReportButton}>
                  <Text style={{ color: "black"}}>Cancel</Text>
                </Button>
                <Button onPress={this.submitReport.bind(this)} style={styles.submitReportButton}>
                  <Text style={{ color: "white"}}>Report</Text>
                </Button>
              </View>
            </View>
          </Modal>
				</View>
			)
		}
	}

}

const styles = StyleSheet.create({
	parentStyle:{
		flex:.1,
		justifyContent : 'center',
		alignItems: 'center'
	},
	separator: {
		marginVertical: 8,
		borderBottomColor: 'black',
		borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  taskListHeader: {
    justifyContent: 'space-between',
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgrey"
  },
  taskListHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  remindButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  reportContainer: {
    backgroundColor: "white",
    padding: 15,
    paddingBottom: 120,
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  reportForm: {
    width: "70%",
    marginBottom: 25,
    justifyContent: "center",
    paddingTop: 20,
  },
  modalButtons: {
    marginTop: 20,
    width: "70%",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  cancelReportButton: {
    justifyContent: "center",
    width: "40%",
    backgroundColor: "lightgrey",
  },
  submitReportButton: {
    justifyContent: "center",
    width: "40%",
    backgroundColor: "tomato",
  }
})

export default HomeScreen;