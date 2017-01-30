import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Keyboard, Alert } from 'react-native';

import GameButton from "./GameButton"
import ProgressBar from "./ProgressBar/ProgressBar"

export default class Game extends Component {
  constructor(){
    super();

    this.state = {
      op1: "loading...",
      op2: "loading...",
      op1votes: 0,
      op2votes: 0,
      voted: false,
      active: false,
      tstamp: 0,
      room: "main",
    };
  }

  componentWillMount(){
    this.props.initFirebase(this.initialized.bind(this));
  }

  initialized(user){
    this.setState({uid: user.uid});
    this.uid = user.uid;

    this.roomRef = this.props.db.ref("rooms/"+this.state.room);
    this.roomRef.child("ops").on("value", ss=> this.onOptionValue(ss.val()));
    this.roomRef.child("op1votes").on("value", ss=> this.setState({op1votes: ss.val()}) );
    this.roomRef.child("op2votes").on("value", ss=> this.setState({op2votes: ss.val()}) );
    this.roomRef.child("timestamp").on("value", ss=> this.setState({tstamp: ss.val()}) );
    this.roomRef.child("active").on("value", ss=> this.setState({active: ss.val()}) );
  }

  componentWillUnmount(){
    //Both of these are untested, so they might not even work
    this.roomRef && this.roomRef.off();
  }

  onOptionValue(val){
    val = val || {};

    this.setState({
      voted: false,
      loaded: true,
      op1: val.op1 || "This is undefined",
      op2: val.op2 || "This is undefined",
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <GameButton
          option={this.state.op1} 
          votes={this.state.op1votes} 
          percentage={this.getPercentage(this.state.op1votes)}
          voted={this.state.voted}
          active={this.state.active}
          chosen={this.state.chosen === "op1"}
          onPress={()=> this.vote("op1", this.state.op1votes)} 
          backgroundColor={"#EC644B"}
          underlayColor={"#c0392b"}
          maxCharsAfterVoting={100} />

        <ProgressBar timestamp={this.state.tstamp || 0}/>

        <GameButton 
            option={this.state.op2} 
            votes={this.state.op2votes} 
            percentage={this.getPercentage(this.state.op2votes)}
            voted={this.state.voted} 
            active={this.state.active}
            chosen={this.state.chosen === "op2"}
            onPress={()=> this.vote("op2", this.state.op2votes)}
            backgroundColor={"#27ae60"}
            underlayColor={"#1E824C"}
            maxCharsAfterVoting={100} />

      </View>
    );
  }

  getPercentage(votes){
    return Math.round( (votes / (this.state.op1votes+this.state.op2votes) ) *100);
  }

  vote(op, votes){
    if(this.state.voted) return console.log("Already voted");
    if(!this.state.active) return console.log("Question is inactive");
    console.log("Voting " + op + " with votes: " + votes);

    const  numRef = this.props.db.ref("rooms/"+this.state.room+"/"+op+"votes");

    this.saveVoteRecord({op})
    .then( () => numRef.transaction(votes=> votes ? ++votes : 1) )
    .then( () => console.log("Successfully voted") )
    .catch( this.voteError.bind(this) );

    this.setState({
      voted: true,
      chosen: op
    });
  }

  saveVoteRecord({op}){
    const ref = this.props.db.ref("votes/"+this.state.room+"/"+this.uid);
    const vote = {
      timestamp: this.props.firebase.database.ServerValue.TIMESTAMP,
      op: op
    };

    return new Promise( (resolve, reject) =>{
      ref.set(vote)
      .then( resolve )
      .catch(err =>{
        console.log("Failed to save vote record to firebase. Has the user already voted?");
        reject("already voted");
      });
    });
  }

  voteError(err){
      console.log("Failed to vote: ", err)

      if(err === "already voted"){
        Alert.alert("Failed to vote", "You have already voted", [{text: 'OK'}]);
        this.setState({voted: true});
        return;
      }

      Alert.alert("Failed to vote", "Please try again", [{text: 'OK'}]);
      this.setState({voted: false});
  }

}

const styles = StyleSheet.create({
  container: {
    height: 264,
    paddingVertical: 8,
  },

});