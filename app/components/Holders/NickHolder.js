import React, { Component } from 'react';
import { View, Alert } from 'react-native';

import Prompt from "../../modified-repos/prompt/Prompt";

export default class NickHolder extends Component {
  constructor(props){
    super(props);
    this.state = {
      promptVisible: false,
      eula: true,
    }
  }

  componentWillMount(){
    const userRef = this.props.db.ref("users/"+this.props.user.uid);

    this.nickRef = userRef.child("nickname");
    this.nickRef.on("value", ss => this.setState({ nick: ss.val(), promptVisible: !ss.val()}))

    this.eulaRef = userRef.child("eula")
    this.eulaRef.on("value", ss => {
      const eula = ss.val()
      this.setState({ eula })
      if(!eula){
        this.showEula()
      }
    })
  }

  componentWillUnmount(){
    this.nickRef && this.nickRef.off()
    this.eulaRef && this.eulaRef.off()
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.eula && this.props.children}

        <Prompt style={{position: "absolute"}}
          title="Enter a nickname"
          placeholder="This is permanent!"
          defaultValue=""
          visible={ this.state.promptVisible }
          onSubmit={ this.onNicknameChosen.bind(this) } />
      </View>
    );
  }

  onNicknameChosen(nick){
    this.setState({promptVisible: !nick});
    if(!nick) return console.log("Invalid nickname");

    this.nickRef.set(nick).then(()=> console.log("Updated nick") )
    .catch(err=> console.log("Failed to update nick") );
  }

  showEula() {
    const url = "https://rather-5d6ed.firebaseapp.com/"
    const title = "Eula"
    const message = "Before you can use this app you have to agree to the EULA found at \n" + url

    Alert.alert(title, message, [
      {
        text: "I don't agree",
        onPress: () => this.eulaDisagreed(),
        style: "destructive",
      },
      {
        text: "I agree",
        onPress: () => this.eulaAgreed(),
        style: "cancel",
      }
    ])
  }

  eulaAgreed(){
    console.log("User agreed to eula")
    this.setState({ eula: Date.now() })
    this.props.db.ref("users/"+this.props.user.uid+"/eula")
    .set( this.props.firebase.database.ServerValue.TIMESTAMP )
    .then(() => console.log("Eula set in firebase"))
    .catch(err => console.log("Failed to set eula in firebase: ", err))
  }
  eulaDisagreed(){
    console.log("User did not agree to eula")
    Alert.alert("I'm sorry", "You cannot use this app without agreeing to the EULA")
  }

}
