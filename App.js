import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, StatusBar, Alert, ActivityIndicator, Text } from 'react-native';

import MyNavigator from "./app/components/Navigator/MyNavigator"
import ScoreHolder from "./app/components/Holders/ScoreHolder"
import NickHolder from "./app/components/Holders/NickHolder"
import firebase from "./app/modules/Firebase"

import codePush from "react-native-code-push"
import DeviceInfo from "react-native-device-info"

class Rathery extends Component {
  constructor(props){
    super(props);

    this.state = {
      user: null,
    };

    if(!__DEV__) {
      console = {};
      console.log = () => {};
      console.error = () => {};
    }
  }

  componentWillMount(){
    let user;
    this.authorizeUser()
    .then(u => (user = u))
    .catch(err=>{
      console.log("Failed to sign in: ", err);
      Alert.alert("Error: "+err.code, err.message);
      Promise.reject("Failed to sign in, not setting state");
    })
    .then(() => this.setState({ user }) )
    .then(() => console.log("User is signed in") )
    .catch(err=> console.log("Failed to set state after authorizing: ", err) )
  }

  authorizeUser(){
    this.email = DeviceInfo.getUniqueID() + "@rathery.no"
    this.password = "RatheryDefaultPassword1996"

    console.log("Email: " + this.email)
    console.log("Password: " + this.password)

    let user = null
    const signIn = () => firebase.auth().signInWithEmailAndPassword(this.email, this.password)

    return new Promise( (resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .catch(err => err.code === "auth/email-already-in-use" ? signIn() : Promise.reject(err))
      .then(user => resolve(user) )
      .catch( reject )
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {!this.state.user &&
          <View style={styles.spinnerContainer}>
            <ActivityIndicator style={styles.spinner} color={"white"}/>
            <Text style={styles.spinnerText}>Connecting</Text>
          </View>
        }
        {this.state.user &&
          <NickHolder db={firebase.database()} firebase={firebase} user={this.state.user} >
            <ScoreHolder db={firebase.database()} firebase={firebase} user={this.state.user} >
              <MyNavigator />
            </ScoreHolder>
          </NickHolder>
        }
      </View>
    );
  }

}

export default codePush(Rathery)
//export default Rathery

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: "#34495e"
  },

  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerText: {
    color: "white",
  },
  spinner: {
    height: 60,
    width: 60,
  }

});
