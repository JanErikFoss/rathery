import React, { Component } from 'react';
import {View} from 'react-native';

export default class ScoreHolder extends Component {
  constructor(props){
    super(props);
    this.state = { score: 0 };
  }

  componentWillMount(){
    this.props.initFirebase(this.firebaseInitialized.bind(this));
  }

  firebaseInitialized(user){
    this.scoreRef = this.props.db.ref("users/"+user.uid+"/score");
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
            ...this.props
          })
        }
      </View>
    );
  }

}