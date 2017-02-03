import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Dimensions, TextInput, KeyboardAvoidingView, TouchableHighlight, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default class PostView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      op1: "",
      op2: "",
      maxLength: this.props.maxLength || 115,
      room: this.props.room || "main",
    };

    this.onFinishPressed = this.onFinishPressed.bind(this);

  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}
          behavior={"padding"}>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.inputsHolder, {height: this.props.height}]}>

            <TextInput style={[styles.input, styles.op1]}
              value={this.state.op1}
              onChangeText={this.textChanged1.bind(this)}
              multiline={true}
              maxLength={this.state.maxLength}
              placeholder={"Live on a space station for a year"} />

            <Text style={styles.middleText}>
              or would you...
            </Text>

            <TextInput style={[styles.input, styles.op2]}
              value={this.state.op2}
              onChangeText={this.textChanged2.bind(this)}
              multiline={true}
              maxLength={this.state.maxLength}
              placeholder={"Live in a submarine for a year"} />

          </View>
        </TouchableWithoutFeedback>

      </KeyboardAvoidingView>
    );
  }

  textChanged1(text){
    this.setState({op1: text})
  }
  textChanged2(text){
    this.setState({op2: text})
  }

  onFinishPressed(cb){ //Called from navigator button
    if(!this.state.op1 || !this.state.op2) return console.log("Missing op");

    this.props.db.ref("ladders/"+this.state.room).push({
      op1: this.state.op1,
      op2: this.state.op2,
      createdAt: this.props.firebase.database.ServerValue.TIMESTAMP,
      poster: this.props.user.uid,
      votes: 0,
    })
    .then(()=> console.log("Finished upload") )
    //.then(()=> Alert.alert("Done", "Your post has been saved", [{text: "ok", onPress: this.props.onFinished}]) )
    .then(()=> this.setState({op1: "", op2: ""}) )
    .then(()=> cb && cb() )
    .then(()=> this.props.navigator.jumpTo(this.props.routes[this.props.route.index - 1]) )
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
    paddingVertical: 8,
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

});