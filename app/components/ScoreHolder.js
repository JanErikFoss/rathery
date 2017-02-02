import React, { Component } from 'react';
import {View} from 'react-native';

import Prompt from "../modified-repos/prompt/Prompt";

export default class ScoreHolder extends Component {
  constructor(props){
    super(props);
    this.state = {
      score: 0,
    };
  }

  componentWillMount(){
    const userRef = this.props.db.ref("users/"+this.props.user.uid);

    this.scoreRef = userRef.child("score");
    this.scoreRef.on("value", ss=> this.setState({score: ss.val()}) );
  }

  componentWillUnmount(){
    this.scoreRef && this.scoreRef.off();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {
          React.cloneElement(this.props.children, { 
            score: this.state.score,
            nick: this.state.nick,
            avatar: this.state.avatar,
            ...this.props
          })
        }

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
    this.setState({
      promptVisible: !nick,
      nick
    });

    this.nickRef.set(nick).then(()=> console.log("Updated nick") )
    .catch(err=> console.log("Failed to update nick") );
  }

}