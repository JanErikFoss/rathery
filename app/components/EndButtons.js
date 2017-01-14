import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image } from 'react-native';

import EndButton from "./EndButton"

export default class BottomButtons extends Component {
  render() {
    return (
      <View style={[this.props.top ? styles.container_top : styles.container_bottom, this.props.style]}>
        {!this.props.hideLeft &&
        <EndButton top={this.props.top}
          onPress={this.props.leftOnPress}
          alignItems={this.props.leftAlignItems}
          style={[styles.left, this.props.leftStyle]} 
          image={this.props.leftImage}
          text={this.props.leftText}
          customComponent={this.props.customLeft}
          left={true} />}

        {!this.props.hideMiddle &&
        <EndButton top={this.props.top}
          onPress={this.props.middleOnPress} 
          alignItems={this.props.middleAlignItems}
          style={[styles.middle, this.props.middleStyle]} 
          image={this.props.middleImage}
          text={this.props.middleText}
          customComponent={this.props.customMiddle}
          middle={true} />}

        {!this.props.hideRight &&
        <EndButton top={this.props.top}
          onPress={this.props.rightOnPress}
          alignItems={this.props.rightAlignItems}
          style={[styles.right, this.props.rightStyle]} 
          image={this.props.rightImage}
          text={this.props.rightText}
          customComponent={this.props.customRight}
          right={true} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container_bottom: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: "rgba(255,255,255, 0.3)"
  },

  container_top: {
    position: "absolute",
    top: 0,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center"
  },

  left: {
    left: 0
  },
  right: {

  },
  middle: {

  },
  leftMiddle: {

  },
  rightMiddle: {

  }

});