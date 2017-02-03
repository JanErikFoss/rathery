import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image, Text, Dimensions } from 'react-native';

import GameButton from "../Lobby/Game/GameButton"
import Arrows from "./Arrows"
import VoteView from "./VoteView"

export default class PostView extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      voted: false,
      votes: null,
      loadingVotes: true,
      loadingVoted: true
    };

    this.state = this.initialState;

  }

  componentDidMount(){
    this.loadVote(this.props.post);
    this.setVoteListener(this.props.post);
  }

  componentWillReceiveProps(props){
    if(this.state.post && props.post && props.post.key === this.state.post.key) 
      return console.log("Received new props but same post");
    this.setState(this.initialState);
    this.loadVote(props.post);
    this.setVoteListener(props.post);
  }

  loadVote(post){
    this.setState({loadingVoted: true});

    const setVoted = voted=> !this.unmounted && this.props.post && this.props.post.key === post.key && this.setState({voted, loadingVoted: false});
    const voteRef = this.props.db.ref("laddervotes/"+this.props.room+"/"+post.key+"/"+this.props.user.uid);
    voteRef.once("value")
    .then( ss => setVoted(ss.exists()) )
    .catch(err=> console.log("Failed to load vote: ", err) );
  }

  setVoteListener(post){
    this.removeListener && this.removeListener();
    this.setState({loadingVotes: true});

    const setVotes = votes=> !this.unmounted && this.props.post && this.props.post.key === post.key && this.setState({votes, loadingVotes: false});
    const ref = this.props.db.ref("ladders/"+this.props.room+"/"+post.key+"/votes");
    ref.on("value", 
      ss => setVotes(ss.val()), 
      err=> console.log("Failed to listen for votes value: ", err) );

    this.removeListener = ()=> ref.off();
  }

  componentWillUnmount(){
    this.removeListener && this.removeListener();
    this.removeListener = null;
    this.unmounted = true;
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={[styles.buttonsHolder, {height: this.props.height}]}>
          <GameButton inactive={true}
              option={this.props.post.op1} 
              backgroundColor={"#2C3E50"}
              underlayColor={"#2C3E50"}
              textColor={"white"}
              showSpinner={this.props.loading} />

          <View style={styles.middleView} />

          <GameButton inactive={true}
              option={this.props.post.op2} 
              backgroundColor={"#2C3E50"}
              underlayColor={"#2C3E50"}
              textColor={"white"} 
              showSpinner={this.props.loading} />
        </View>

        <Arrows
            new={this.props.new}
            index={this.props.index}
            leftActive={this.props.leftActive}
            rightActive={this.props.rightActive}
            onBackPressed={this.props.onBackPressed}
            onForwardPressed={this.props.onForwardPressed} >

          <VoteView 
            new={this.props.new}
            index={this.props.index}
            voted={this.state.loadingVoted ? false : this.state.voted}
            votes={this.state.loadingVotes ? "..." : this.state.votes || 0}
            timestamp={this.props.post.createdAt}
            onPress={this.onVote.bind(this)} />

        </Arrows>

      </View>
    );
  }

  onVote(){
    if(!this.props.post) return console.log("this.props.post is invalid");
    this.setState({voted: true});

    const voteRef = this.props.db.ref("laddervotes/"+this.props.room+"/"+this.props.post.key+"/"+this.props.user.uid);
    const laddRef = this.props.db.ref("ladders/"+this.props.room+"/"+this.props.post.key+"/votes");

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