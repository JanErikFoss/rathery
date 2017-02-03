import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';

import ProgressBar from 'react-native-progress/Bar';

export default class ProgressBarPureChild extends Component {
  render() {
    return (
      <ProgressBar 
        style={styles.bar}
        height={10}
        width={Dimensions.get('window').width - barPadding*2}
        progress={this.props.progress || 0} />
    );
  }
}

const barPadding = 10;
const styles = StyleSheet.create({
  bar: {
    marginLeft: barPadding,
    marginVertical: 8
  }
});