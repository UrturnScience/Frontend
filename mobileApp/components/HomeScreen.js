import React, { Component } from 'react';
import {StyleSheet, View, Text, ScrollView, RefreshControl} from 'react-native';
import { Container, Header, Content, ListItem, CheckBox, Body, CardItem, Card, ListView } from 'native-base';
import { Updates } from 'expo';
import { onSessionWasInterrupted } from 'expo/build/AR';
import { fetchUpdateAsync } from 'expo/build/Updates/Updates';
// Required for connecting to backend
import { BACKEND_URL } from '../config';
import Axios from 'axios';
import { DbContext } from '../context';

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
            refreshing: false
        }
    
    }

    static contextType = DbContext

    getAssignments(user) {
        this._assignmentsRequest = Axios.get(`${BACKEND_URL}/assignment/active/${user._id}`).then(response => {
            // this.setState({
            //     assignments: response.data.assignments
            // })
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
        console.log("CURRENT ASSIGNMENTS: ", this.state.assignments);
        this.setState({refreshing: false});
    }

    componentDidMount() {
        this.getAssignments(this.context.user);
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

    //sets the refreshing spinner while data is being retrieved from the backend
    onRefresh(){
        this.setState({refreshing: true});
        this.getAssignments(this.context.user)
    }

    render(){
        if (this.state.assignments == null) {
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
                        <Text style={{fontWeight:'bold',fontSize:40}}>Home</Text>
                    </View>

                    <Separator />
                    <ScrollView 
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)}/>}
                    contentContainerStyle={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <Text>You have no chores this week!</Text>
                        </View>
                    </ScrollView>
                </View>
            )
        }
        else {
            return(
                <View style={{ marginTop:40, flex: 1 }}>
                    
                    <View style={styles.parentStyle}>
                        <Text style={{fontWeight:'bold',fontSize:40}}>Home</Text>
                    </View>

                    <Separator />
                    
                    <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)}/>}>
                        <Card>
                            
                            <CardItem header style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 16}}>My Chores This Week</Text>
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
    }
})

export default HomeScreen;