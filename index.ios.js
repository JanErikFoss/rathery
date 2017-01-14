import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, StatusBar } from 'react-native';

import Firebase from "./app/modules/Firebase";
import Lobby from "./app/components/Lobby";

export default class Rather extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Lobby db={Firebase.database()} firebase={Firebase} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: "white"
  },

});

AppRegistry.registerComponent('Rather', () => Rather);
