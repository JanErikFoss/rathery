import React, { Component } from 'react';
import { StyleSheet, View, ListView, Text, Dimensions } from 'react-native';

export default class Chat extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.data}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "lightgray"
  },

  text: {
    color: "black",
  }
});