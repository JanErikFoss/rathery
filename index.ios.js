import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import App from "./App.js"

export default class Rathery extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('Rathery', () => Rathery);