import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';

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
    };
  }

  componentWillMount(){
    console.log("Game component will mount");
    
    this.props.firebase.auth().onAuthStateChanged( user=> {
      if(!user) return console.log("Game.js: Failed to initialize game, user is null");

      this.setState({uid: user.uid});

      const mainRef = this.props.db.ref("rooms/main");
      mainRef.child("ops").on("value", ss=> this.onOptionValue({ss: ss}));
      mainRef.child("op1votes").on("value", ss=> this.onVoteValue({ss: ss, name: "op1votes"}));
      mainRef.child("op2votes").on("value", ss=> this.onVoteValue({ss: ss, name: "op2votes"}));

      this.props.db.ref("users/"+user.uid+"/score").on("value", ss=> {
        this.props.onScoreChanged(ss.val());
      });
    });
  }

  onOptionValue({ss}){
    const val = ss.val();
    //console.log("Val: ", val);

    this.setState({
      voted: false,
      loaded: true,
      op1: val.op1 || "This is undefined",
      op2: val.op2 || "This is undefined",
    });
  }

  onVoteValue({ss, name}){
    //console.log(name + ": " + ss.val());
    this.setState({[name]: ss.val()});
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

    this.props.db.ref("votes/main/"+this.state.uid).set(op);

    this.setState({
      voted: true,
      chosen: op
    });
  }

}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height - 20 - 40) / 2.6,
    paddingBottom: 10
  },

});