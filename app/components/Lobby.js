import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, Platform } from 'react-native';

import Game from "./Game/Game"
import Chat from "./Chat/Chat"

export default class Lobby extends Component {
  render() {
    return (
      <View style={styles.container}>

        <Game {...this.props} />
        <Chat {...this.props} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495e"
  },

});