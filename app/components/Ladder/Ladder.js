import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Alert, TouchableHighlight, Image } from 'react-native';

import EndButtons from "../EndButtons/EndButtons"
import PostView from "./PostView"
import WritePage from "./WritePage"

export default class Ladder extends Component {
  constructor(props){
    super(props);

    this.state = {
      showNew: this.props.showNew || false //We dont rely on the prop
    };

    this.props.titleRef(()=> this.state.showNew ? "Best submissions" : "New submissions");
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.questionContainer} >

          {this.state.showNew ||
            <PostView {...this.props} /> }

          {this.state.showNew &&
            <PostView {...this.props} new={true}/> }

        </View>

        <TouchableHighlight style={styles.writeHighlight}
            onPress={this.changeState.bind(this)} underlayColor={"transparent"}>
          <Image source={this.state.showNew
            ? require("../../images/new.png")
            : require("../../images/best.png")} style={styles.writeImage}/>
        </TouchableHighlight>

      </View>
    );
  }

  changeState(){
    console.log("Changing showNew");

    this.setState(prev=> {
      return {showNew: !prev.showNew};
    }, this.props.titleChanged);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495e"
  },

  questionContainer: {
    flex: 1,
    paddingTop: 8,
  },

  writeHighlight: {
    padding: 5,
    alignItems: "center",

  },
  writeImage: {
    height: 50,
    width: 50,
  }

});