import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Alert, TouchableHighlight, Image } from 'react-native';

import EndButtons from "../EndButtons/EndButtons"
import PostView from "./PostView"
import WritePage from "./WritePage"

export default class Ladder extends Component {
  constructor(props){
    super(props);

    this.state = {
      ladderState: this.props.ladderState || 0,
    };

    this.props.titleRef(()=> this.state.ladderState === 0 ? "Best submissions" : "New submissions");
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.questionContainer} >

          {this.state.ladderState === 0 &&
            <PostView {...this.props} /> }

          {this.state.ladderState === 1 &&
            <PostView {...this.props} new={true}/> }

        </View>

        <TouchableHighlight style={styles.writeHighlight}
            onPress={this.changeLadderState.bind(this)} underlayColor={"transparent"}>
          <Image source={this.state.ladderState == 0 
            ? require("../../images/new.png")
            : require("../../images/best.png")} style={styles.writeImage}/>
        </TouchableHighlight>

      </View>
    );
  }

  changeLadderState(){
    console.log("Changing ladderState");

    this.setState(prev=> {
      return {ladderState: prev.ladderState === 1 ? 0 : 1};
    }, this.props.titleChanged);
  }

  onWritePressed(){
    console.log("Write pressed");
    this.setState({ladderState: 2});
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495e"
  },

  questionContainer: {
    flex: 1,
    paddingTop: 8,
  },

  writeHighlight: {
    padding: 5,
    alignItems: "center",

  },
  writeImage: {
    height: 50,
    width: 50,
  }

});