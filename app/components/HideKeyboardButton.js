import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';

export default class Lobby extends Component {

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.hideKeyboard.bind(this)} >
        <View style={styles.view} >
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  hideKeyboard(){
    console.log("Hiding keyboard");
  }

  writePressed(){
    console.log("Write pressed");
  }

  cashPressed(){
    console.log("Cash pressed")
  }

  onScoreChanged(score){
    this.setState({score: score || 0})
  }

}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "red"
  },

  view2: {
    flexDirection: "row",
    flex: 1,
  }

});