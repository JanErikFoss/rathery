import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';

export default class LadderList extends Component {

  render() {
    return (
      <View style={styles.container}>

        <ActivityIndicator
            style={styles.spinner} 
            color={"white"} />

      </View>
    );
  }

}

const imageSize = Dimensions.get('window').width * 0.12;
const imagePadding = 5;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#22313F",
    justifyContent: "center",
    padding: 50,
  },

  spinner: {

  }

});