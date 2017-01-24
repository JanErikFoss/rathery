import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image, Text, Dimensions } from 'react-native';

import GameButton from "../Game/GameButton"

export default class PostView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight underlayColor={"transparent"} 
            onPress={this.props.onBackPressed}
            style={[styles.highlight, styles.backHighlight]}>
          <View style={styles.imageHolder}>
            <Image style={[styles.image, styles.back]} source={this.getLeftImage()} />
          </View>
        </TouchableHighlight>

        {this.props.children}

        <TouchableHighlight underlayColor={"transparent"} 
            onPress={this.props.onForwardPressed}
            style={[styles.highlight, styles.forwardHighlight]}>
          <View style={styles.imageHolder}>
            <Image style={[styles.image, styles.forward]} source={this.getRightImage()} />
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  getLeftImage(){
    return this.props.leftActive
      ? require("../../images/back.png")
      : require("../../images/back.png");
  }

  getRightImage(){
    return this.props.rightActive
      ? require("../../images/forward.png")
      : require("../../images/forward.png");
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 3,
    alignItems: "center",
  },
  highlight: {
    flexDirection: "column",
  },
  imageHolder: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  image: {
    height: 40,
    width: 40,
  },

});