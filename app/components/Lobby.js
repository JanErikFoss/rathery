import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, Platform } from 'react-native';

import EndButtons from "./EndButtons/EndButtons"
import Game from "./Game/Game"
import Chat from "./Chat/Chat"
import Shop from "./Shop/Shop"
import Ladder from "./Ladder/Ladder"

export default class Lobby extends Component {
  constructor(props){
    super();
    this.state = {
      lobbyState: 0
    };

  }

  render() {
    return (
      <View style={styles.container}>

        <Game {...this.props} onScoreChanged={this.onScoreChanged.bind(this)}/>
        <Chat {...this.props} uid={this.uid} />

      </View>
    );
  }

  shopPressed(){
    console.log("Cash pressed");
    this.setState({lobbyState: 1});
  }
  shopFinished(){
    console.log("Shop finished");
    this.setState({lobbyState: 0}); 
  }

  ladderPressed(){
    console.log("Ladder pressed");
    this.setState({lobbyState: 2});
  }
  ladderFinished(){
    console.log("Ladder finished");
    this.setState({lobbyState: 0});
  }

  onScoreChanged(score){
    console.log("Score changed: " + score);
    this.setState({score: score || 0})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495e"
  },

});