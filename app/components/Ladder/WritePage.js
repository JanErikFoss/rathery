import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Dimensions, TextInput, KeyboardAvoidingView, TouchableHighlight, Alert } from 'react-native';

import EndButtons from "../EndButtons/EndButtons"

export default class PostView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      op1: "",
      op2: "",
      maxLength: this.props.maxLength || 140,
      room: this.props.room || "main",
    };
  }

  componentDidMount(){
    this.props.firebase.auth().onAuthStateChanged( user=> {
      if(!user) return console.log("LadderList.js: Failed to initialize, user is null");

      this.uid = user.uid;

    });
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.inputsHolder}>

          <TextInput style={[styles.input, styles.op1]}
            value={this.state.op1}
            onChangeText={this.textChanged1.bind(this)}
            multiline={true}
            placeholder={"Live on a space station for a year"} />

          <Text style={styles.middleText}>
            or would you...
          </Text>

          <TextInput style={[styles.input, styles.op2]}
            value={this.state.op2}
            onChangeText={this.textChanged2.bind(this)}
            multiline={true}
            placeholder={"Live in a submarine for a year"} />

        </View>

        <KeyboardAvoidingView 
          style={styles.avoidingView} 
          behavior={"padding"}>

          <View style={styles.highlightHolder}>
            <TouchableHighlight style={styles.highlight} underlayColor={"transparent"}
                onPress={this.onFinish.bind(this)}>
              <Image source={require("../../images/forward.png")} style={styles.bottomImage} />
            </TouchableHighlight>
          </View>

        </KeyboardAvoidingView>

      </View>
    );
  }

  textChanged1(text){
    this.setState({op1: text.substring(0, this.state.maxLength)})
  }
  textChanged2(text){
    this.setState({op2: text.substring(0, this.state.maxLength)})
  }

  onFinish(){
    if(!this.state.op1 || !this.state.op2) return console.log("Missing op");

    this.props.db.ref("ladders/"+this.state.room).push({
      op1: this.state.op1,
      op2: this.state.op2,
      createdAt: this.props.firebase.database.ServerValue.TIMESTAMP,
      poster: this.uid,
      votes: 0,
    })
    .then(()=> console.log("Finished upload") )
    .then(()=> Alert.alert("Done", "Your post has been saved", [{text: "ok", onPress: this.props.onFinished}]) )
    .catch(err=> {
      console.log("Failed to upload: " + err);
      Alert.alert("Oh no", "An error occurred, please try again", [{text: "ok"}])
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495e",
  },

  middleText: {
    color: "white",
    textAlign: "center",
    padding: 5
  },

  inputsHolder: {
    height: Dimensions.get('window').height / 2.7
  },
  inputHolders: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    color: "black",
    fontSize: 15
  },
  op1: {},
  op2: {},

  avoidingView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  highlightHolder: {
    flex: 1, 
    alignItems: "center",
    backgroundColor: "#22313F",
  },
  highlight: {
    padding: 5,
  },
  bottomImage:{
    height: 50,
    width: 50,
  }

});