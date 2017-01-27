import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, StatusBar } from 'react-native';

import Firebase from "./app/modules/Firebase";
import MyNavigator from "./app/components/MyNavigator";
import ScoreHolder from "./app/components/ScoreHolder";

export default class Rather extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" /> 
        <ScoreHolder db={Firebase.database()} firebase={Firebase} initFirebase={this.initFirebase.bind(this)} >
          <MyNavigator />
        </ScoreHolder>
      </View>
    );
  }

  initFirebase(cb){
    return cb 
      ? this.initFirebaseWithCallback(cb) 
      : this.initFirebaseWithPromise();
  }

  initFirebaseWithCallback(cb){
    Firebase.auth().onAuthStateChanged( user=>{
      user ? cb(user) : console.log("Firebase init failed, user was null in onAuthStateChanged");
    });
  }

  initFirebaseWithPromise(){
    return new Promise( (resolve, reject) => {
      Firebase.auth().onAuthStateChanged( user=>{
        if(user) return resolve(user);
        console.log("Firebase init failed, user was null in onAuthStateChanged");
        reject("Firebase init failed, user was null in onAuthStateChanged");
      });
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: "#34495e"
  },

});

AppRegistry.registerComponent('Rather', () => Rather);