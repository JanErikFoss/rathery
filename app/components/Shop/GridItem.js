import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, ActivityIndicator, TouchableHighlight } from 'react-native';

export default class LadderList extends Component {
  render() {
    return (
      <TouchableHighlight style={styles.touchable}
          underlayColor={"transparent"}
          onPress={this.onPress.bind(this)} >
        <View style={[this.props.style, styles.container, {backgroundColor: this.getBackgroundColor()}]}>

          <View style={styles.imageContainer}>
            {this.props.data.loading || this.props.data.buying
              ? <ActivityIndicator style={styles.spinner} />
              : <Image style={styles.image}
                  source={this.getImage()} />
            }
          </View>

          <Text style={[styles.text, styles.title]}>{this.props.data.title}</Text>
          {!this.props.data.loading &&
            <Text style={[styles.text, styles.cost]}>☆{this.props.data.cost}</Text>
          }

          {this.props.isCurrentAvatar &&
            <Image style={styles.checkmark} source={require("../../images/checkmark.png")} />
          }

        </View>
      </TouchableHighlight>
    );
  }

  onPress(){
    if(!this.props.data.active) return console.log("Row is inactive");

    this.props.onPress
      ? this.props.onPress(this.props.data)
      : console.log("No onPress prop for GridItem.js");
  }

  getImage(){
    switch(this.props.data.image){
      case "hat1": return require("../../images/shop/hat1.png");
      case "hat2": return require("../../images/shop/hat2.png");
      case "hat3": return require("../../images/shop/hat3.png");
      case "hat4": return require("../../images/shop/hat4.png");
      case "hat5": return require("../../images/shop/hat5.png");
      case "hat6": return require("../../images/shop/hat6.png");
      case "hat7": return require("../../images/shop/hat7.png");
      case "hat8": return require("../../images/shop/hat8.png");
      case "trollface": return require("../../images/shop/trollface.png");
      default: return require("../../images/transparent.png");
    }
  }

  getBackgroundColor(){
    if(this.props.data.loading) return "white";
    if(this.props.data.bought) return "#27ae60"; //Green
    if(!this.props.data.active) return "gray"; // ... Gray
    return "white";
  }

}

const containerSize = 170;
const imageSize = 90;
const checkMarkSize = 15;
const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    justifyContent: "center",
    width: containerSize,
    height: containerSize,
  },

  touchable: {
    width: containerSize,
    height: containerSize,
    margin: 5,
  },

  text: {
    color: "black",
    textAlign: "center",
    padding: 5,
    paddingBottom: 0,
  },

  title: {
    fontSize: 15
  },
  cost: {
    fontSize: 13,
  },

  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: imageSize,
    height: imageSize,
  },

  spinner: {
    width: imageSize,
    height: imageSize
  },

  checkmark: {
    position: "absolute",
    bottom: 5,
    left: 5,
    width: checkMarkSize,
    height: checkMarkSize,
  }

});
