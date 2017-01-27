import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import App from "./index.js"

export default class Rather extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('Rather', () => Rather);