import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, Image, ActivityIndicator } from 'react-native';

export default class Game extends Component {
  render() {
    return (
      <View style={styles.container}> 
        <TouchableHighlight style={[styles.touchable, {backgroundColor: this.props.backgroundColor}]}
            onPress={this.props.onPress} underlayColor={this.props.underlayColor || "transparent"}>
          <View style={styles.innerContainer}>
            {!this.props.showSpinner &&
              <Text style={[styles.text, styles.optionText, {color: this.props.textColor || "white"}]}
                  ellipsizeMode={"tail"}
                  numberOfLines={6} >
                {this.getOptionText()}
              </Text> 
            }
            {this.props.showSpinner &&
              <ActivityIndicator style={styles.spinner} color={"white"} size={"small"} />
            }
            
            {((this.props.voted || !this.props.active) && !this.props.inactive) &&
              <View style={styles.infoTextContainer}>
                <Text style={[styles.text, styles.infoText, styles.votesText, {color: this.props.textColor || "white"}]}>{this.props.votes || 0}</Text>
                <Text style={[styles.text, styles.infoText, styles.percentageText, {color: this.props.textColor || "white"}]}>{this.props.percentage || 0}%</Text>
              </View>
            }
            {this.props.voted && this.props.chosen &&
              <Image style={styles.checkmark} source={require("../../../images/checkmark.png")} />
            }
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  getOptionText(){
    return (this.props.voted || !this.props.active)
      ? this.getShortOption() 
      : this.props.option;
  }

  getShortOption(){
    const maxChars = this.props.maxCharsAfterVoting || 80;
    return this.props.option.length > maxChars
      ? this.props.option.substring(0, maxChars) + "..."
      : this.props.option;
  }

}

checkMarkSize = 20;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 0,
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
    borderRadius: 3,
    backgroundColor: "transparent"
  },

  optionText: {
    fontSize: 16,
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