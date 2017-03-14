import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Keyboard, Alert, TouchableWithoutFeedback } from 'react-native';

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
      timestamp: 0,
      room: "main",
    }

    this.voteError = this.voteError.bind(this)
  }

  componentWillMount(){
    const onErr = err => console.log("Listener error in Game.js: ", err)
    this.roomRef = this.props.db.ref("rooms/"+this.state.room)

    this.opsRef = this.roomRef.child("ops")
    this.opsRef.on("value", ss => this.onOptionValue(ss.val()), onErr)

    this.op1votesRef = this.roomRef.child("op1votes")
    this.op1votesRef.on("value", ss => this.setState({ op1votes: ss.val() }), onErr)

    this.op2votesRef = this.roomRef.child("op2votes")
    this.op2votesRef.on("value", ss => this.setState({ op2votes: ss.val() }), onErr)

    this.tsRef = this.roomRef.child("timestamp")
    this.tsRef.on("value", ss => this.setState({ timestamp: ss.val() }), onErr)

    this.activeRef = this.roomRef.child("active")
    this.activeRef.on("value", ss => this.setState({ active: ss.val() }), onErr)

    this.intervalRef = this.roomRef.child("updateInterval")
    this.intervalRef.on("value", ss => this.setState({ updateInterval: ss.val() }), onErr)

    this.voteRef = this.props.db.ref("votes/"+this.state.room+"/"+this.props.user.uid)
    this.voteRef.on("value", ss => {
      const op = ss.val()
      this.setState({ voted: !!op, chosen: op })
    })
  }

  componentWillUnmount(){
    this.roomRef.off()
    this.voteRef.off()
    this.opsRef.off()
    this.op1votesRef.off()
    this.op2votesRef.off()
    this.tsRef.off()
    this.activeRef.off()
    this.intervalRef.off()
  }

  onOptionValue(val){
    this.setState({
      voted: false,
      loaded: true,
      op1: val && val.op1 || "Undefined option",
      op2: val && val.op2 || "Undefined option",
    })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
        <View style={[styles.container, {height: this.props.height}]}>
          <GameButton
              option={this.state.op1}
              votes={this.state.op1votes}
              percentage={this.getPercentage(this.state.op1votes)}
              voted={this.state.voted}
              active={this.state.active}
              chosen={this.state.chosen === "op1"}
              onPress={()=> this.vote("op1", this.state.op1votes)}
              backgroundColor={this.state.active || !this.min(this.state.op1votes) ? "#EC644B" : "#c0392b"}
              underlayColor={"#c0392b"}
              maxCharsAfterVoting={80} />

          <ProgressBar timestamp={this.state.timestamp || 0} interval={this.state.updateInterval || 60}/>

          <GameButton
              option={this.state.op2}
              votes={this.state.op2votes}
              percentage={this.getPercentage(this.state.op2votes)}
              voted={this.state.voted}
              active={this.state.active}
              chosen={this.state.chosen === "op2"}
              onPress={()=> this.vote("op2", this.state.op2votes)}
              backgroundColor={this.getBackgroundColorOp2()}
              underlayColor={"#1E824C"}
              maxCharsAfterVoting={80} />

        </View>
      </TouchableWithoutFeedback>
    );
  }

  getBackgroundColorOp2(){
    return this.state.active || !this.min(this.state.op2votes) ? "#27ae60" : "#1E824C"
  }

  min(votes){
    return votes === Math.min(this.state.op1votes, this.state.op2votes);
  }

  getPercentage(votes){
    return Math.round( (votes / (this.state.op1votes+this.state.op2votes) ) *100);
  }

  vote(op, votes){
    if(this.state.voted) return console.log("Already voted");
    if(!this.state.active) return console.log("Question is inactive");
    console.log("Voting " + op + " with votes: " + votes);

    this.saveVoteRecord({ op })
    .then( () => console.log("Successfully voted") )
    .catch( this.voteError )

    this.setState({
      voted: true,
      chosen: op
    });
  }

  saveVoteRecord({ op }){
    const ref = this.props.db.ref("votes/"+this.state.room+"/"+this.props.user.uid)

    return new Promise((resolve, reject) => {
      ref.set( op )
      .then( resolve )
      .catch(err => {
        console.log("Failed to save vote record to firebase. Has the user already voted?")
        reject("already voted")
      })
    })
  }

  voteError(err){
      console.log("Failed to vote: ", err)

      if(err === "already voted"){
        Alert.alert("Failed to vote", "You have already voted");
        this.setState({ voted: true })
        return;
      }

      console.log("Failed to vote: ", err)
      Alert.alert("Failed to vote", "Please try again")
      this.setState({ voted: false })
  }

}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },

});
