import React, { Component } from 'react';
import {View} from 'react-native';

export default class ScoreHolder extends Component {
  constructor(props){
    super(props);
    this.state = {score: 0};
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
            score: ()=> this.state.score || 0,
            ...this.props
          })
        }
      </View>
    );
  }

}