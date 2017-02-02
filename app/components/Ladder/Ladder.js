import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Alert, TouchableHighlight, Image } from 'react-native';

import PostView from "./PostView"
import WritePage from "./WritePage"

export default class Ladder extends Component {
  constructor(props){
    super(props);

    this.state = {
      showNew: this.props.showNew || false //We dont rely on the prop
    };

    this.getTitle = this.getTitle.bind(this);
  }

  getTitle(){
    return this.state.showNew ? "New submissions" : "Best submissions";
  }

  render() {
    return (
      <View style={styles.container}>

        {this.state.showNew ||
          <PostView {...this.props} /> }

        {this.state.showNew &&
          <PostView {...this.props} new={true}/> }

        <TouchableHighlight style={styles.highlight}
            onPress={this.changeState.bind(this)} underlayColor={"transparent"}>
          <Image source={this.state.showNew
            ? require("../../images/best.png")
            : require("../../images/new.png")} style={styles.image}/>
        </TouchableHighlight>

      </View>
    );
  }

  changeState(){
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
  },

  highlight: {
    padding: 5,
    alignItems: "center",

  },
  image: {
    height: 50,
    width: 50,
  }

});