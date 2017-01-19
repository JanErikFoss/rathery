import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

import EndButtons from "./EndButtons"
import LadderList from "./LadderList"

export default class Ladder extends Component {
  render() {
    return (
      <View style={styles.container}>

        <EndButtons top={true}
          leftImage={"back"}
          leftOnPress={this.props.onFinished}
          middleText={"Ladder"}
          rightImage={"new"}
          leftOnPess={this.props.onNewPressed} />

        <View style={styles.listContainer} >
          <LadderList {...this.props} 
            loadMax={20}
            room={"main"} />
        </View>

      </View>
    );
  }

  onNewPressed(){
    console.log("New pressed");
  }

}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: "#34495e"
  },

  listContainer: {
    height: Dimensions.get('window').height - 60,
    marginTop: 60,
  }

});