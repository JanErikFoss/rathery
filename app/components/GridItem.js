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
            <Text style={[styles.text, styles.cost]}>${this.props.data.cost}</Text>
          }

        </View>
      </TouchableHighlight>
    );
  }

  onPress(){
    this.props.onPress 
      ? this.props.onPress(this.props.data)
      : console.log("No onPress prop for GridItem.js");
  }

  getImage(){
    switch(this.props.data.image){
      case "rank1": return require("../images/shop/rank1.png");
      case "rank2": return require("../images/shop/rank2.png");
      case "rank3": return require("../images/shop/rank3.png");
      case "rank4": return require("../images/shop/rank4.png");
      case "rank5": return require("../images/shop/rank5.png");
      case "rank6": return require("../images/shop/rank6.png");
      case "rank7": return require("../images/shop/rank7.png");
      case "rank8": return require("../images/shop/rank8.png");
      case "trollface": return require("../images/shop/trollface.png");
      default: return require("../images/transparent.png");
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
  }

});