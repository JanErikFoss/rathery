import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, Image, Dimensions, Animated } from 'react-native';

export default class LadderList extends Component {

  constructor(props){
    super(props);

    this._defaultTransition  = 250;

    this.state = {
      _rowOpacity : new Animated.Value(0)
    };
  }

  componentDidMount() {
    Animated.timing(this.state._rowOpacity, {
      toValue  : 1,
      duration : this._defaultTransition
    }).start()
  }

  render() {
    return (
      <Animated.View style={[styles.container, {opacity: this.state._rowOpacity}]}>

        <View style={styles.opContainer}>

          <Text style={[styles.op, styles.static, styles.head]}>Would you rather</Text>
          <Text style={[styles.op, styles.op1]}>{this.props.data.op1 || "Invalid option"}</Text>
          <Text style={[styles.op, styles.static, styles.middle]}>or would you</Text>
          <Text style={[styles.op, styles.op2]}>{this.props.data.op2 || "Invalid option"}</Text>

        </View>

        <TouchableHighlight style={styles.highlight}
            onPress={this.onVote.bind(this)} underlayColor={"transparent"} >
          <View style={styles.buttonInnerContainer}>
            <Image style={styles.image} 
              source={ this.props.data.voted 
                          ? require("../images/upvoted_outlined.png")
                          : require("../images/upvote_outlined.png") } />
            <Text style={styles.votesText}>
              {this.props.data.votes || 0}
            </Text>
          </View>
        </TouchableHighlight>

      </Animated.View>
    );
  }

  onVote(){
    this.props.onVote 
      ? this.props.onVote(this.props.data)
      : console.log("No onVote prop at LadderListItem.js");
  }

}

const imageSize = Dimensions.get('window').width * 0.12;
const imagePadding = 5;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingBottom: 0,
    flexDirection: "row",
  },

  opContainer: {
    width: Dimensions.get('window').width,
    backgroundColor: "#22313F",
  },

  op: {
    color: "silver",
    padding: 5,
    paddingRight: imageSize + 2*imagePadding,
  },
  op1: {
  },
  op2: {
  },

  static: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },

  highlight: {
    justifyContent: "center",
    width: imageSize,
    marginLeft: -imageSize -imagePadding
  }, 
  buttonInnerContainer: {

  },

  image: {
    width: imageSize,
    height: imageSize,
  },
  votesText: {
    color: "white",
    textAlign: "center"
  }

});