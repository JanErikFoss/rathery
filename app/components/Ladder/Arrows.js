import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image, Text, Dimensions } from 'react-native';

import GameButton from "../Game/GameButton"

export default class PostView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight underlayColor={"transparent"} 
            onPress={()=> this.props.leftActive && this.props.onBackPressed()}
            style={[styles.highlight, {alignItems: "flex-start"}]}>
          <View style={[styles.innerContainer, {justifyContent: "flex-start"}]}>
            <Image style={[styles.image, styles.back]} source={this.getLeftImage()} />
            <Text style={styles.indexText}>
              {!this.props.new && this.props.leftActive ? this.props.index + "." : " "}
            </Text> 
          </View>
        </TouchableHighlight>

        {this.props.children}

        <TouchableHighlight underlayColor={"transparent"} 
            onPress={()=> this.props.rightActive && this.props.onForwardPressed()}
            style={[styles.highlight, {alignItems: "flex-end"}]}>
          <View style={[styles.innerContainer, {justifyContent: "flex-end"}]}>
            <Text style={styles.indexText}>
              {!this.props.new && this.props.rightActive ? (this.props.index + 2)+"." : " "}
            </Text> 
            <Image style={[styles.image, styles.forward]} source={this.getRightImage()} />
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  getLeftImage(){
    return this.props.leftActive
      ? require("../../images/back.png")
      : require("../../images/transparent.png");
  }

  getRightImage(){
    return this.props.rightActive
      ? require("../../images/next.png")
      : require("../../images/transparent.png");
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 2.7,
    flexDirection: "row",
    alignItems: "center",
  },
  highlight: {
    width: Dimensions.get("window").width / 5,
    alignItems: "flex-end",
  },

  innerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  innerContainerRight: {
    justifyContent: "flex-end",
  },
  innerContainerLeft: {
    justifyContent: "flex-start",
  },

  imageHolder: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    height: 40,
    width: 40,
  },

  indexText: {
    color: "silver",
  }

});