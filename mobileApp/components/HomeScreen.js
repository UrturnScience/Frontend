import React, { Component } from 'react';
import {StyleSheet, View, Text, ScrollView, RefreshControl} from 'react-native';
import { Container, Header, Content, ListItem, CheckBox, Body, CardItem, Card, ListView } from 'native-base';
import { Updates } from 'expo';
import { onSessionWasInterrupted } from 'expo/build/AR';
import { fetchUpdateAsync } from 'expo/build/Updates/Updates';
// Required for connecting to backend
import { BACKEND_URL } from 'react-native-dotenv';
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
            // here is some hard-coded data of what the chores object might look like once we get receive it from
            // the backend request
            choresToDo: [
                {
                    id: 1,
                    choreTitle: "Take Out Trash",
                    isChoreCompleted: false
                },
                {
                    id: 2,
                    choreTitle: "Do Laundry",
                    isChoreCompleted: false
                },
                {
                    id: 3,
                    choreTitle: "Wash Dishes",
                    isChoreCompleted: false
                },
                {
                    id: 4,
                    choreTitle: "Sweep Living Room",
                    isChoreCompleted: false
                }
            ],
            refreshing: false
        }
    
    }

    static contextType = DbContext

    getAssignments(user) {
        this._assignmentsRequest = Axios.get(`${BACKEND_URL}/assignment/active/${user._id}`).then(response => {
            console.log(response.data);
        })
        this.setState({refreshing: false});
    }

    // toggles the chore as completed/not completed
    toggleChoreCompletion(responseObj, choreID){
        this.setState(prevState => ({
            choresToDo: prevState.choresToDo.map(
                chore => chore.id === choreID? {...chore, isChoreCompleted: !chore.isChoreCompleted}: chore
            )
        }))
    }

    //sets the refreshing spinner while data is being retrieved from the backend
    onRefresh(){
        this.setState({refreshing: true});
        this.getAssignments(this.context.user)
    }

    render(){

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
                            this.state.choresToDo.map(chore => (
                                <ListItem key={chore.id}>
                                    <CheckBox color="#3284f7" checked={chore.isChoreCompleted} onPress={(responseObj) => this.toggleChoreCompletion(responseObj, chore.id)}/>
                                    <Body style={{padding: 10}}>
                                        <Text>{chore.choreTitle}</Text>
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
    }
})

export default HomeScreen;