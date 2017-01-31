import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import App from "./index.js"

export default class Rathery extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('Rathery', () => Rathery);