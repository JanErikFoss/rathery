import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard } from 'react-native';

import EndButtons from "./EndButtons"
import Game from "./Game"
import Chat from "./Chat"
import Shop from "./Shop"
import Ladder from "./Ladder"

export default class Lobby extends Component {
  constructor(props){
    super();
    this.state = {
      lobbyState: 0,
      score: 0
    };

  }

  render() {
    return (
      <View style={styles.container}>

        <Game {...this.props} onScoreChanged={this.onScoreChanged.bind(this)}/>
        <Chat {...this.props} uid={this.uid} />

        <EndButtons top={true}
          leftImage={"cash"}
          leftOnPress={this.shopPressed.bind(this)}
          middleText={"$"+this.state.score}
          rightImage={"ladder"}
          rightOnPress={this.ladderPressed.bind(this)} />

        { this.state.lobbyState === 1 &&
          <Shop {...this.props} 
            score={this.state.score}
            onFinished={this.shopFinished.bind(this)} />
        }

        { this.state.lobbyState === 2 &&
          <Ladder {...this.props}
            onFinished={this.ladderFinished.bind(this)} />
        }

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
    paddingTop: 60,
    flex: 1,
    backgroundColor: "#34495e"
  },

});