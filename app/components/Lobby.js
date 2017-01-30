import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';

import Game from "./Game/Game"
import Chat from "./Chat/Chat"

export default class Lobby extends Component {
  render() {
    return (
      <View style={styles.container}>

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
          <Game {...this.props} />
        </TouchableWithoutFeedback>
        <Chat {...this.props} dismissOnSend={true} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495e",
  },

});