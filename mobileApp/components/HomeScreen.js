import React, { Component } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { Container, Header, Content, ListItem, CheckBox, Body, CardItem, Card } from 'native-base';
import { Updates } from 'expo';


// function to add a horizontal black line on the screen to separate areas of the app
function Separator() {
    return <View style={styles.separator} />;
}

class HomeScreen extends Component {

    constructor(props){
    
        super(props);
        
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
            ]
        }
    
    }

    // toggles the chore as completed/not completed
    toggleChoreCompletion(responseObj, choreID){
        this.setState(prevState => ({
            choresToDo: prevState.choresToDo.map(
                chore => chore.id === choreID? {...chore, isChoreCompleted: !chore.isChoreCompleted}: chore
            )
        }))
    }

    render(){

        return(

            <View style={{ marginTop:40, flex: 1 }}>
                
                <View style={styles.parentStyle}>
                    <Text style={{fontWeight:'bold',fontSize:40}}>Home</Text>
                </View>

                <Separator />

                <Card>
                    
                    <CardItem header style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>My Chores This Week</Text>
                    </CardItem>

                    {
                        this.state.choresToDo.map(chore => (
                            <ListItem key={chore.id}>
                                <CheckBox checked={chore.isChoreCompleted} onPress={(responseObj) => this.toggleChoreCompletion(responseObj, chore.id)}/>
                                <Body style={{padding: 10}}>
                                    <Text>{chore.choreTitle}</Text>
                                </Body>
                            </ListItem>
                        ))
                    }

                </Card>
            
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
      },
})

export default HomeScreen;