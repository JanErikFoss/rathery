import * as firebase from 'firebase';

firebase.initializeApp({
  apiKey: "AIzaSyANrMqFMnAGrvpYo3g6isNjkdJkJQWI9qg",
  authDomain: "rather-5d6ed.firebaseapp.com",
  databaseURL: "https://rather-5d6ed.firebaseio.com",
  storageBucket: "rather-5d6ed.appspot.com",
  messagingSenderId: "774818862156"
});
module.exports = firebase;


let initial = true;
const listener = firebase.auth().onAuthStateChanged( user=> {
  !user && initial && signin();
  initial = false;
});

const signin = ()=>{
  console.log("Signing in...");
  firebase.auth().signInAnonymously()
  .then( signedin )
  .catch( e=> {
    console.log("Error signing in anonymously: "+e.code+" -> "+e.message);
    //Show alert here
  });
}

const signedin = user=>{
	console.log("Signed in");
}