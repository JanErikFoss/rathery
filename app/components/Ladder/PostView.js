import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image, Text, Dimensions } from 'react-native';

import GameButton from "../Game/GameButton"
import Arrows from "./Arrows"
import VoteView from "./VoteView"

export default class PostView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      room: "main",
      op1: "Loading...",
      op2: "Loading...",
      votes: 0,
      voted: false,
      index: this.props.index || 0,
    };

    this.posts = [];
    this.listeners = [];

  }

  componentDidMount(){
    this.props.firebase.auth().onAuthStateChanged( user=> {
      if(!user) return console.log("LadderList.js: Failed to initialize, user is null");

      this.uid = user.uid;

      const roomRef = this.props.db.ref("ladders/"+this.state.room);
      const query = this.props.new
        ? roomRef.orderByChild("createdAt").limitToFirst(20)
        : roomRef.orderByChild("votes").limitToLast(20);

      query.once("value")
      .then(allSS=> allSS.forEach(ss=>{
        this.posts.push({ key: ss.key, ...ss.val() })
      }))
      .then(()=> this.posts.reverse() )
      //.then(()=> this.posts.forEach(post=> this.setVoteListener(post)) )
      .then(()=> this.posts.forEach(post=> this.loadVote(post)) )
      .then(()=> console.table(this.posts) )
      .then( this.newPost.bind(this) )
      .catch(err=> console.log("Error loading posts: ", err) );

    });
  }

  newPost(index = 0){
    if(index < 0 || index >= this.posts.length) return console.log("Invalid index: " + index);

    this.removeListeners();
    this.setVoteListener(this.posts[index]);

    console.log("Showing post with index " + index + ": ", this.posts[index]);
    this.setState({
      index, 
      ...this.posts[index],
      voted: this.posts[index].voted,
      leftActive: index > 0,
      rightActive: index < this.posts.length-1
    });
  }

  loadVote(post){
    const hasVotedFor = ()=>{
      post.voted = true;
      this.state.key === post.key && this.setState({voted: true});
    };

    const voteRef = this.props.db.ref("laddervotes/"+this.state.room+"/"+post.key+"/"+this.uid);
    voteRef.once("value")
    .then( ss => ss.exists() && hasVotedFor() )
    .catch(err=> console.log("Failed to load vote: ", err) );
  }

  setVoteListener(post){
    const onValue = votes=>{
      post.votes = votes;
      this.state.key === post.key && this.setState({votes});
    };

    const ref = this.props.db.ref("ladders/"+this.state.room+"/"+post.key+"/votes");
    ref.on("value", 
      ss => onValue(ss.val()), 
      err=> console.log("Failed to listen for votes value: ", err) );

    this.listeners.push(()=> ref.off() );
  }

  onBackPressed(){
    this.newPost(this.state.index-1);
  }
  onForwardPressed(){
    this.newPost(this.state.index+1);
  }

  componentWillUnmount(){
    this.removeListeners();
  }

  removeListeners(){
    this.listeners.forEach( off => off() );
    this.listeners = [];
  }

  render() {
    return (
      <View style={styles.container}>

        <GameButton inactive={true}
            option={this.state.op1} 
            onPress={()=> console.log("Gamebutton clicked")} 
            backgroundColor={"#e74c3c"}
            underlayColor={"#e74c3c"} />

        <View style={styles.middleView} />

        <GameButton inactive={true}
            option={this.state.op2} 
            onPress={()=> console.log("Gamebutton clicked")} 
            backgroundColor={"#27ae60"}
            underlayColor={"#27ae60"} />

        <Arrows 
            leftInactive={this.state.active}
            rightInactive={this.state.active}
            onBackPressed={this.onBackPressed.bind(this)}
            onForwardPressed={this.onForwardPressed.bind(this)} >

          <VoteView 
            voted={this.state.voted}
            votes={this.state.votes}
            timestamp={this.state.createdAt}
            onPress={this.onVote.bind(this)}/>

        </Arrows>

      </View>
    );
  }

  onVote(){
    if(!this.state.key) return console.log("Invalid key");
    console.log("Voting " + this.state.key);
    const post = this.posts.find(post=> post.key === this.state.key);
    post.voted = true;
    this.setState({voted: true});

    const voteRef = this.props.db.ref("laddervotes/"+this.state.room+"/"+this.state.key+"/"+this.uid);
    const laddRef = this.props.db.ref("ladders/"+this.state.room+"/"+this.state.key+"/votes");

    voteRef.set( this.props.firebase.database.ServerValue.TIMESTAMP )
    .then( () => console.log("Vote record saved") )
    .then( () => laddRef.transaction(votes=> votes ? ++votes : 1) )
    .then( () => console.log("Successfully completed laddervote action") )
    .catch(err=>{
      console.log("Failed to vote: ", err);
      post.voted = false;
      this.setState({voted: false});
    });
  }

}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height - 120,
    backgroundColor: "#34495e",
    //backgroundColor: "white",
  },

  middleView: {
    padding: 10,
  },

});