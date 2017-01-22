import React, { Component } from 'react';
import { } from 'react-native';

import ProgressBarPureChild from "./ProgressBarPureChild"
import Timer from "react-native-timer"

export default class ProgressBar extends Component {
  constructor(props){
    super(props);
    this.state = {ts: props.timestamp};
  }

  componentWillReceiveProps(props){
    this.setState({ts: props.timestamp});
  }

  componentDidMount(){
    const cb = ()=> this.setState({progress: (Date.now()-this.state.ts) / 20000});
    Timer.setInterval("progress", ()=> !this.unmounted && cb(), 100);
  }

  componentWillUnmount(){
    this.unmounted = true;
    Timer.clearInterval("progress");
  }

  render() {
    return (
      <ProgressBarPureChild progress={this.state.progress} />
    );
  }

}