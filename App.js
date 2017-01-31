import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, StatusBar, Alert } from 'react-native';

import MyNavigator from "./app/components/MyNavigator";
import ScoreHolder from "./app/components/ScoreHolder";
import firebase from "./app/modules/Firebase";

import DeviceInfo from "react-native-device-info"

export default class Rather extends Component {
  constructor(props){
    super(props);

    this.state = {
      user: null
    };
  }

  componentWillMount(){
    let user;
    this.authorizeUser().then(u=> user = u)
    .catch(err=>{
      console.log("Failed to sign in: ", err);
      Alert.alert("Error: "+err.code, err.message);
      Promise.reject("Failed to sign in, not setting state");
    })
    .then(() => this.setState({user: user}) )
    .then(() => console.log("User is signed in") )
    .catch(err=> console.log("Failed to set state after authorizing: ", err) )
  }

  authorizeUser(){
    this.email = DeviceInfo.getUniqueID() + "@rathery.no";
    this.password = "RatheryDefaultPassword1996";

    console.log("Email: " + this.email);
    console.log("Password: " + this.password);

    return new Promise( (resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .catch(err=> err.code === "auth/email-already-in-use" ? this.signIn() : Promise.reject(err) )
      .then( resolve )
      .catch( reject )
    });
  }

  signIn(){
    return firebase.auth().signInWithEmailAndPassword(this.email, this.password);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {this.state.user &&
          <ScoreHolder db={firebase.database()} firebase={firebase} user={this.state.user} >
            <MyNavigator />
          </ScoreHolder>
        }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: "#34495e"
  },

});