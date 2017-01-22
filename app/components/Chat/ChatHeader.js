import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text, Dimensions } from 'react-native';

export default class Chat extends Component {
  render() {
    return (
      <TouchableHighlight style={styles.container} underlayColor={"transparent"} 
          onPress={this.resize.bind(this)}>
        <Text style={styles.text}>Resize</Text>
      </TouchableHighlight>
    );
  }

  resize(){
    this.props.onResize ? this.props.onResize()
    : console.log("ChatHeader.js: Resize function prop is undefined.");
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },

  text: {
    textAlign: "center",
    color: "black",
  }
});