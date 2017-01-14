import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

export default class Game extends Component {
  render() {
    return (
      <Text style={styles.text}>or</Text>
    );
  }

}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    color: "white",
  }

});