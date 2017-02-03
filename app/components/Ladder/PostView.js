import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image, Text, Dimensions } from 'react-native';

import GameButton from "../Lobby/Game/GameButton"
import Arrows from "./Arrows"
import VoteView from "./VoteView"

export default class PostView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      room: "main",
      op1: "",
      op2: "",
      votes: 0,
      voted: false,
      index: this.props.index || 0,
      limit: this.props.limit || 20
    };

    this.posts = [];
    this.listeners = [];

  }

  componentDidMount(){
    this.loadBatch({limit: this.state.limit})
    .then(()=> this.newPost(this.state.index) )
    .catch( console.log );
  }

  loadBatch({limit}){
    console.log("Loading batch with limit " + limit);
    this.state.limit !== limit && this.setState({limit});

    const roomRef = this.props.db.ref("ladders/"+this.state.room);
    const query = this.props.new
      ? roomRef.orderByChild("createdAt").limitToLast(limit)
      : roomRef.orderByChild("votes").limitToLast(limit);

    const posts = [];

    return new Promise( (resolve, reject)=>{
      query.once("value")
      .then(allSS=> allSS.forEach(ss=>{
        posts.push({ key: ss.key, ...ss.val() })
      }))
      .then(()=> posts.reverse() )
      .then(()=> this.posts = posts )
      //.then(()=> console.table(this.posts) )
      .then( resolve )
      .catch(err=> reject("Error loading batch: " + err) );
    });
  }

  newPost(index = 0){
    if(this.unmounted) return console.log("Unmounted, disregarding newPost() call in PostView.js")
    if(index < 0 || index >= this.posts.length) return console.log("Invalid index: " + index);
    const post = this.posts[index];
    console.log("Showing post with index " + index);

    !post.voted && this.loadVote(post);

    this.removeListeners();
    this.setVoteListener(post);

    //console.log("Showing post with index " + index + ": ", post);
    this.setState({
      index, 
      ...post,
      voted: post.voted,
      votes: "...",
      leftActive: index > 0,
      rightActive: index < this.posts.length-1
    });

    if(index === this.posts.length-1){
      this.loadBatch({limit: this.state.limit+20})
      .then(()=> console.log("Finished loading new batch") )
      .then( this.forceUpdate.bind(this) )
      .catch( console.log );
    }
  }

  loadVote(post){
    const voteRef = this.props.db.ref("laddervotes/"+this.state.room+"/"+post.key+"/"+this.props.user.uid);
    voteRef.once("value")
    .then( ss => {
      post.voted = ss.exists();
      this.state.key === post.key && !this.unmounted && this.setState({voted: post.voted});
    })
    .catch(err=> console.log("Failed to load vote: ", err) );
  }

  setVoteListener(post){
    const ref = this.props.db.ref("ladders/"+this.state.room+"/"+post.key+"/votes");
    ref.on("value", ss => {
      post.votes = ss.val();
      this.state.key === post.key && !this.unmounted && this.setState({votes: post.votes});
    }, err=> console.log("Failed to listen for votes value: ", err) );

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
    this.unmounted = true;
  }

  removeListeners(){
    this.listeners.forEach( off => off() );
    this.listeners = [];
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={[styles.buttonsHolder, {height: this.props.height}]}>
          <GameButton inactive={true}
              option={this.state.op1} 
              backgroundColor={"#2C3E50"}
              underlayColor={"#2C3E50"}
              textColor={"white"} />

          <View style={styles.middleView} />

          <GameButton inactive={true}
              option={this.state.op2} 
              backgroundColor={"#2C3E50"}
              underlayColor={"#2C3E50"}
              textColor={"white"} />
        </View>

        <Arrows
            new={this.props.new}
            index={this.state.index}
            leftActive={this.state.index > 0}
            rightActive={this.state.index < this.posts.length-1}
            onBackPressed={this.onBackPressed.bind(this)}
            onForwardPressed={this.onForwardPressed.bind(this)} >

          <VoteView 
            new={this.props.new}
            index={this.state.index}
            voted={this.state.voted}
            votes={this.state.votes}
            timestamp={this.state.createdAt}
            onPress={this.onVote.bind(this)} />

        </Arrows>

      </View>
    );
  }

  onVote(){
    if(!this.state.key) return console.log("Invalid key");
    const post = this.posts.find(post=> post.key === this.state.key);
    post.voted = true;
    this.setState({voted: true});

    const voteRef = this.props.db.ref("laddervotes/"+this.state.room+"/"+this.state.key+"/"+this.props.user.uid);
    const laddRef = this.props.db.ref("ladders/"+this.state.room+"/"+this.state.key+"/votes");

    voteRef.set( this.props.firebase.database.ServerValue.TIMESTAMP )
    .then( () => console.log("Laddervote saved, doing transaction...") )
    .then( () => laddRef.transaction(votes=> votes ? ++votes : 1) )
    .then( () => console.log("Successfully voted") )
    .catch(err=>{
      console.log("Failed to vote: ", err);
      post.voted = false;
      this.setState({voted: false});
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  buttonsHolder: {
    paddingVertical: 8,
  },

  middleView: {
    padding: 13,
  },

});