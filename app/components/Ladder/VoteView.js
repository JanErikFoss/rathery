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
                        : require("../../images/upvote_white.png") } />
          <Text style={[styles.text, styles.votesText]}>
            {this.props.votes || 0}
          </Text>

          {!this.props.new && 
            <Text style={[styles.text, styles.infoText, styles.index]}>
              #{this.props.index + 1}
            </Text> 
          }
          {this.props.new && 
          <Text style={[styles.text, styles.infoText, styles.postedBy]}>
            Upvote if you want this polled
          </Text> }
          <Text style={[styles.text, styles.infoText, styles.age]}>
            {this.getTimeAgo()}
          </Text>

        </View>
      </TouchableHighlight>
    );
  }

  onPress(){
    if(this.props.voted) return console.log("Already voted");

    this.props.onPress 
      ? this.props.onPress()
      : console.log("No onPress prop at LadderListItem.js");
  }

  getTimeAgo(){
    return this.props.timestamp 
      ? "Posted " + this.getTime() + " ago"
      : " ";
  }

  getTime(){
    const secs = Math.floor((new Date() - this.props.timestamp) / 1000);
    let i = Math.floor(secs / 31536000); //Interval
    const s = ()=> i===1 ? "" : "s";

    if (i >= 1) return i + " year"+s();
    i = Math.floor(secs / 2592000);
    if (i >= 1) return i + " month"+s();
    i = Math.floor(secs / 86400);
    if (i >= 1) return i + " day"+s();
    i = Math.floor(secs / 3600);
    if (i >= 1) return i + " hour"+s();
    i = Math.floor(secs / 60);
    if (i >= 1) return i + " minute"+s();
    i = Math.floor(secs);
    return i + " second"+s();
  }

}

const styles = StyleSheet.create({
  highlight: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
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
    paddingTop: 15,
    color: "silver",
  },
  postedBy: {
    textAlign: "center"
  },
  index: {
    fontWeight: "normal",
  },

  image: {
    width: 50,
    height: 50,
  },
  votesText: {
    fontSize: 24,
    textAlign: "center",
  },

});