import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image, Text, Dimensions } from 'react-native';

import GameButton from "../Game/GameButton"

export default class PostView extends Component {
  render() {
    return (
      <TouchableHighlight style={styles.highlight} underlayColor={"transparent"}
          onPress={this.onPress.bind(this)} >
        <View style={styles.buttonInnerContainer}>
        
          <Image style={styles.image} 
            source={ this.props.voted 
                        ? require("../../images/upvoted.png")
                        : require("../../images/upvote.png") } />
          <Text style={[styles.text, styles.votesText]}>
            {this.props.votes || 0}
          </Text>

          <Text style={[styles.text, styles.infoText, styles.postedBy]}>
            Posted by Lille-Kristoffer
          </Text>
          <Text style={[styles.text, styles.infoText, styles.age]}>
            22 minutes ago
          </Text>

        </View>
      </TouchableHighlight>
    );
  }

  onPress(){
    if(this.props.voted) return console.log("Already voted");

    this.props.onPress 
      ? this.props.onPress(this.props.data)
      : console.log("No onPress prop at LadderListItem.js");
  }

}

const imageSize = Dimensions.get('window').width * 0.12;
const imagePadding = 5;
const styles = StyleSheet.create({
  highlight: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    width: imageSize,
    marginHorizontal: 20,
  }, 
  buttonInnerContainer: {
    flex: 1,
    alignItems: "center"
  },

  text: {
    color: "white"
  },
  infoText: {
    fontWeight: "100",
    paddingTop: 20,
    color: "silver",
  },

  image: {
    width: imageSize,
    height: imageSize,
  },
  votesText: {
    fontSize: 20,
    textAlign: "center",
  }

});