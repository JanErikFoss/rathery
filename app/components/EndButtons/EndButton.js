import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image, Text } from 'react-native';

export default class BottomButtons extends Component {
  render() {
    return (
        <TouchableHighlight underlayColor={"transparent"}
            style={this.getTouchableStyle()} 
            onPress={this.props.onPress} >
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

  getTouchableStyle(){
    const posStyle = this.props.top ? styles.topButton : styles.botButton;
    const alignItems = {alignItems: this.getAlignItems()};
    return [styles.button, posStyle, alignItems];
  }
  getAlignItems(){
    if(this.props.middle) return "center";
    return this.props.right ? "flex-end" : "flex-start"
  }

  getImage(src, top, style){
    const imageStyle = [top ? styles.topImage : styles.bottomImage, style]; //Image style
    const image = source=> (<Image style={imageStyle} source={source} resizeMode={Image.resizeMode.contain} />);

    switch(src){
      case "back":    return image(require("../../images/back.png"));
      case "upvote":  return image(require("../../images/upvote.png"));
      case "upvoted": return image(require("../../images/upvoted.png"));
      case "write":   return image(require("../../images/write.png"));
      case "cash":    return image(require("../../images/cash.png"));
      case "ladder":  return image(require("../../images/ladder.png"));
      case "new":     return image(require("../../images/new.png"));
      case "best":    return image(require("../../images/best.png"));
      case "forward": return image(require("../../images/forward.png"));
      case "home":    return image(require("../../images/home.png"));
      case "remove":  return image(require("../../images/remove.png"));
      default:        return image(require("../../images/transparent.png"));
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
    padding: 5,
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