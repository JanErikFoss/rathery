import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image, Text } from 'react-native';

export default class BottomButtons extends Component {
  render() {
    return (
        <TouchableHighlight onPress={this.props.onPress} style={[styles.button, this.props.top ? styles.topButton : styles.botButton, {alignItems: this.props.middle ? "center" : (this.props.right? "flex-end":"flex-start")}]} underlayColor={"transparent"} >
          <View style={styles.innerContainer}>
            
            { this.props.image &&
              this.getImage(this.props.image, this.props.top, this.props.style)}

            { this.props.text &&
              <Text style={styles.text}>{this.props.text}</Text>}

            {this.props.customComponent &&
             this.props.customComponent}

          </View>
        </TouchableHighlight>
    );
  }

  getImage(src, top, style){
    switch(src){
      case "back": 
        return <Image source={require("../../images/back.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "back_outlined": 
        return <Image source={require("../../images/back_outlined.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "upvote": 
        return <Image source={require("../../images/upvote.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "upvoted": 
        return <Image source={require("../../images/upvoted.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "write": 
        return <Image source={require("../../images/write.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "cash": 
        return <Image source={require("../../images/cash.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "ladder": 
        return <Image source={require("../../images/ladder.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "new": 
        return <Image source={require("../../images/new.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "best": 
        return <Image source={require("../../images/best.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "forward": 
        return <Image source={require("../../images/forward.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "home": 
        return <Image source={require("../../images/home.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "double_arrow": 
        return <Image source={require("../../images/double_arrow.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      case "remove": 
        return <Image source={require("../../images/remove.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
      default:
        return <Image source={require("../../images/transparent.png")} resizeMode={Image.resizeMode.contain} style={[top ? styles.topImage : styles.bottomImage, style]} />
    }
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 4,
  },
  innerContainer: {
  },

  topButton: {
    margin: 0,
    marginTop: 5,
  },
  botButton: {
  },

  bottomImage: {
    borderRadius: 5,
    width: 50,
    height: 50,
  },

  topImage: {
    borderRadius: 5,
    width: 30,
    height: 30
  },

  text: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold"
  }

});