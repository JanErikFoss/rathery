import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';

import EndButtons from "../EndButtons/EndButtons"
import PostView from "./PostView"

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

        <View style={styles.questionContainer} >

          {this.state.ladderState === 0 &&
            <PostView {...this.props} /> }

          {this.state.ladderState === 1 &&
            <PostView {...this.props} new={true}/> }

        </View>

        <EndButtons style={{backgroundColor: "#22313F"}}
            middleImage={"write"}
            middleOnPress={this.onWritePressed.bind(this)} />

      </View>
    );
  }

  onNewPressed(){
    console.log("Changing ladderState");

    this.setState({
      ladderState: 1 - this.state.ladderState
    });
  }

  onWritePressed(){
    console.log("Write pressed");


  }

}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: "#34495e"
  },

  questionContainer: {
    height: Dimensions.get('window').height - 60,
    marginTop: 60,
  }

});