import React, { Component } from 'react';
import { } from 'react-native';

import ProgressBarPureChild from "./ProgressBarPureChild"
import Timer from "react-native-timer"

export default class ProgressBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      ts: props.timestamp,
      interval: props.interval || 60,
    }
  }

  componentWillReceiveProps(props){
    this.setState({
      ts: props.timestamp,
      interval: props.interval || 60,
    })
  }

  componentDidMount(){
    const cb = ()=> this.setState({progress: this.getProgress()});
    Timer.setInterval("progress", ()=> !this.unmounted && cb(), 100);
  }

  getProgress(){
    const prog = (Date.now()-this.state.ts) / ((this.state.interval * 0.67) * 1000)
    return prog < 1
      ? 1-prog
      : 2*(prog-1)
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
