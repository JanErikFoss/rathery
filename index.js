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
    let initialized = false;
    let listener = Firebase.auth().onAuthStateChanged( user=>{
      if(initialized) return console.log("Already initialized, dismissing");
      initialized = true;
      listener();
      
      user ? cb(user) : console.log("Firebase init failed, user was null in onAuthStateChanged");
    });
  }

  initFirebaseWithPromise(){
    let initialized = false;
    return new Promise( (resolve, reject) => {
      let listener = Firebase.auth().onAuthStateChanged( user=>{
        if(initialized) return console.log("Already initialized, dismissing");
        initialized = true;
        listener();

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