import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

import EndButtons from "../EndButtons/EndButtons"
import LadderList from "./LadderList"

export default class Ladder extends Component {
  constructor(props){
    super(props);

    this.state = {
      ladderState: this.props.ladderState || 0,
    };
  }

  render() {
    return (
      <View style={styles.container}>

        <EndButtons top={true}
          leftImage={"back"}
          leftOnPress={this.props.onFinished}
          middleText={this.state.ladderState === 0 ? "Best questions" : "New questions"}
          rightImage={this.state.ladderState === 0 ? "new" : "best"}
          rightOnPress={this.onNewPressed.bind(this)} />

        <View style={styles.listContainer} >

          {this.state.ladderState === 0 &&
            <LadderList {...this.props} 
              loadMax={50}
              room={"main"} />
          }
          {this.state.ladderState === 1 &&
            <LadderList {...this.props} 
              loadMax={50}
              room={"main"}
              new={true} />
          }

          <EndButtons
            middleText={"Post a question"}
            middleStyle={{backgroundColor: "mistyrose", height: 60}} />
        </View>

      </View>
    );
  }

  onNewPressed(){
    console.log("Changing ladderState");

    this.setState({
      ladderState: 1 - this.state.ladderState
    });
  }

}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: "#34495e"
  },

  listContainer: {
    height: Dimensions.get('window').height - 60,
    marginTop: 60,
  }

});