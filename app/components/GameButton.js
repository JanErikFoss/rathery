import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, Image } from 'react-native';

export default class Game extends Component {
  render() {
    return (
      <View style={styles.container}> 
        <TouchableHighlight style={[styles.touchable, {backgroundColor: this.props.backgroundColor}]}
            onPress={this.props.onPress} underlayColor={this.props.underlayColor || "transparent"}>
          <View style={styles.innerContainer}>
            <Text style={[styles.text, styles.optionText]}>{this.props.voted ? this.getShortOption() : this.props.option}</Text>
            
            {this.props.voted && 
              <View style={styles.infoTextContainer} >
                <Text style={[styles.text, styles.infoText, styles.votesText]}>{this.props.votes}</Text>
                <Text style={[styles.text, styles.infoText, styles.percentageText]}>{this.props.percentage}%</Text>
              </View>
            }
            {this.props.voted && this.props.chosen &&
              <Image style={styles.checkmark}
                  source={require("../images/checkmark.png")} />
            }
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  getShortOption(){
    const maxChars = this.props.maxCharsAfterVoting || 100;
    if(this.props.option.length <= maxChars) 
      return this.props.option;
    return this.props.option.substring(0, maxChars) + "...";
  }

}

checkMarkSize = 20;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    borderRadius: 6
  },

  touchable: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 3
  },

  innerContainer: {
    flex: 1,
    justifyContent: "center",
  },

  text:{
    color: "white",
    textAlign: "center",
  },

  optionText: {
    fontSize: 13,
  },

  infoTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  infoText: {
    paddingHorizontal: 30,
  },
  votesText: {
    fontSize: 18,
  },
  percentageText: {
    fontSize: 18,
  },

  checkmark: {
    position: "absolute",
    bottom: 5,
    left: 5,
    width: checkMarkSize,
    height: checkMarkSize,
  }

});