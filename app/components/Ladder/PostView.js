import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image, Text, Dimensions } from 'react-native';

import GameButton from "../Game/GameButton"
import Arrows from "./Arrows"
import VoteView from "./VoteView"

export default class PostView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      room: "main",
      op1: "Loading...",
      op2: "Loading...",
      votes: 0,
      voted: false,
    }

  }

  componentDidMount(){
    this.props.firebase.auth().onAuthStateChanged( user=> {
      if(!user) return console.log("LadderList.js: Failed to initialize, user is null");

      this.uid = user.uid;

      this.query = this.props.db.ref("ladders/"+this.state.room).orderByChild("votes").startAt(this.state.index).limitToFirst(1);
      this.listener = this.query.once("child_added", ss=>{
        const val = ss.val();
        if(!val) return console.log("Ladder value was null");
        this.setState({

        });
      });

    });
  }

  loadVotedFor(row){
    const ref = this.props.db.ref("laddervotes/"+this.props.room+"/"+row.id+"/"+this.uid);
    ref.once("value", 
      ss => ss.exists() && this.changeRow(row, {voted: true}), 
      err=> console.log("Failed to load vote for ladder question: ", err));
  }

  onVote(data){
    if(!rowData.id) return console.log("Invalid id");
    if(rowData.voted) return console.log("Already voted");
    console.log("Voting for id " + rowData.id);
    this.changeRow(rowData, {voted: true});

    const voteRef = this.props.db.ref("laddervotes/"+this.props.room+"/"+rowData.id+"/"+this.uid);
    const laddRef = this.props.db.ref("ladders/"+this.props.room+"/"+rowData.id+"/votes");

    voteRef.set( this.props.firebase.database.ServerValue.TIMESTAMP )
    .then( () => console.log("Vote record saved") )
    .then( () => laddRef.transaction(votes=> votes ? ++votes : 1) )
    .then( () => console.log("Successfully completed laddervote action") )
    .catch(err=>{
      console.log("Failed to vote: ", err);
      this.changeRow(rowData, {voted: false});
    });

  }

  render() {
    return (
      <View style={styles.container}>

        <GameButton inactive={true}
            option={"Option 1"} 
            onPress={()=> console.log("Gamebutton clicked")} 
            backgroundColor={"#e74c3c"}
            underlayColor={"#e74c3c"} />

        <View style={styles.middleView} />

        <GameButton inactive={true}
            option={"Option 2"} 
            onPress={()=> console.log("Gamebutton clicked")} 
            backgroundColor={"#27ae60"}
            underlayColor={"#27ae60"} />

        <Arrows 
            onBackPressed={()=> console.log("Back")}
            onForwardPressed={()=> console.log("Forward")} >

          <VoteView voted={false} onPress={()=> console.log("Voting")}/>

        </Arrows>

      </View>
    );
  }

  onBackPressed(){
    console.log("Back pressed");
  }
  onForwardPressed(){
    console.log("Forward pressed");
  }

}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height - 120,
    backgroundColor: "#34495e",
    //backgroundColor: "white",
  },

  middleView: {
    padding: 10,
  },

});