import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';

import GameButton from "./GameButton"
import MiddleInfo from "./MiddleInfo"

export default class Game extends Component {
  constructor(){
    super();

    this.state = {
      op1: "loading...",
      op2: "loading...",
      op1votes: 0,
      op2votes: 0,
      voted: false,
      room: "main",
    };
  }

  componentWillMount(){
    console.log("Game component will mount");
    
    this.props.firebase.auth().onAuthStateChanged( user=> {
      if(!user) return console.log("Game.js: Failed to initialize game, user is null");

      this.setState({uid: user.uid});
      this.uid = user.uid;

      const roomRef = this.props.db.ref("rooms/"+this.state.room);
      roomRef.child("ops").on("value", ss=> this.onOptionValue({ss: ss}));
      roomRef.child("op1votes").on("value", ss=> this.setState({op1votes: ss.val()}) );
      roomRef.child("op2votes").on("value", ss=> this.setState({op2votes: ss.val()}) );

      const scoreRef = this.props.db.ref("users/"+user.uid+"/score");
      scoreRef.on("value", ss=> this.props.onScoreChanged(ss.val()) );
    });
  }

  onOptionValue({ss}){
    const val = ss.val();

    this.setState({
      voted: false,
      loaded: true,
      op1: val.op1 || "This is undefined",
      op2: val.op2 || "This is undefined",
    });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
        <View style={styles.container}>
          <GameButton
            option={this.state.op1} 
            votes={this.state.op1votes} 
            totalVotes={this.state.op1votes + this.state.op2votes} 
            voted={this.state.voted}
            chosen={this.state.chosen === "op1"}
            onPress={()=> this.vote("op1", this.state.op1votes)} 
            backgroundColor={"#e74c3c"}
            underlayColor={"#c0392b"}
            maxCharsAfterVoting={100} />

          <MiddleInfo />

          <GameButton 
              option={this.state.op2} 
              votes={this.state.op2votes} 
              totalVotes={this.state.op1votes + this.state.op2votes} 
              voted={this.state.voted} 
              chosen={this.state.chosen === "op2"}
              onPress={()=> this.vote("op2", this.state.op2votes)}
              backgroundColor={"#27ae60"}
              underlayColor={"#1E824C"}
              maxCharsAfterVoting={100} />

        </View>
      </TouchableWithoutFeedback>
    );
  }

  vote(op, votes){
    if(this.state.voted) return console.log("Already voted");
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
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height - 20 - 40) / 2.6,
    paddingBottom: 10
  },

});