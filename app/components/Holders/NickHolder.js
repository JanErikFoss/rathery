import React, { Component } from 'react';
import {View} from 'react-native';

import Prompt from "../../modified-repos/prompt/Prompt";

export default class NickHolder extends Component {
  constructor(props){
    super(props);
    this.state = {promptVisible: false};
  }

  componentWillMount(){
    const userRef = this.props.db.ref("users/"+this.props.user.uid);

    this.nickRef = userRef.child("nickname");
    this.nickRef.on("value", ss=> this.setState({nick: ss.val(), promptVisible: !ss.val()}))
  }

  componentWillUnmount(){
    this.nickRef && this.nickRef.off();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.props.children}

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

}