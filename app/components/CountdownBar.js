import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

import ProgressBar from 'react-native-progress/Bar';
import Timer from "react-native-timer"

export default class Game extends Component {
  constructor(props){
    super(props);

    this.state = {timestamp: props.timestamp};
  }

  componentWillReceiveProps(props){
    this.setState({timestamp: props.timestamp});
  }

  componentDidMount(){
    Timer.setInterval("progressInterval", ()=>{
      this.unmounted
        ? Timer.clearInterval("progressInterval")
        : this.onInterval();
    }, 100);
  }

  onInterval(){
    this.setState(prev=>{
      return {progress: (Date.now()-this.state.timestamp) / 20000};
    });
  }

  componentWillUnmount(){
    this.unmounted = true;
  }

  render() {
    return (
      <View style={styles.container}> 
        <ProgressBar style={styles.bar} 
          progress={this.state.progress}
          width={Dimensions.get('window').width - barPadding*2}
          height={10} />
      </View>
    );
  }

}

const barPadding = 10;
const styles = StyleSheet.create({
  container: {

  },

  bar: {
    marginLeft: barPadding,
  }

});