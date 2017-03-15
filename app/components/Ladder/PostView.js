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

    this.onReport = this.onReport.bind(this)
    this.onVote = this.onVote.bind(this)
  }

  componentDidMount(){
    if(this.props.post && this.props.post.invalid)
      return this.setState({loadingVotes: false, loadingVoted: false, voted: false, votes: null});

    this.loadVote(this.props.post);
    this.setVoteListener(this.props.post);
  }

  componentWillReceiveProps(props){
    if(props.post && props.post.invalid)
      return this.setState({loadingVotes: false, loadingVoted: false, voted: false, votes: null});

    if(this.state.post && props.post && props.post.key === this.state.post.key)
      return console.log("Received new props but same post");

    this.setState(this.initialState);
    this.loadVote(props.post);
    this.setVoteListener(props.post);
  }

  loadVote(post){
    this.setState({loadingVoted: true});

    const setVoted = voted => !this.unmounted && this.props.post && this.props.post.key === post.key && this.setState({voted, loadingVoted: false})
    const voteRef = this.props.db.ref("laddervotes/"+this.props.room+"/"+post.key+"/"+this.props.user.uid)
    voteRef.once("value")
    .then( ss => setVoted(ss.exists()) )
    .catch(err => console.log("Failed to load vote: ", err))
  }

  setVoteListener(post){
    this.removeListener && this.removeListener();
    this.setState({loadingVotes: true});

    const setVotes = votes => !this.unmounted && this.props.post && this.props.post.key === post.key && this.setState({votes, loadingVotes: false})
    const ref = this.props.db.ref("ladders/"+this.props.room+"/"+post.key+"/votes")
    ref.on("value",
      ss => setVotes(ss.val()),
      err => console.log("Failed to listen for votes value: ", err))

    this.removeListener = ()=> ref.off();
  }

  componentWillUnmount(){
    this.removeListener && this.removeListener()
    this.removeListener = null
    this.unmounted = true
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
            onPress={this.onVote}
            onReport={this.onReport} />

        </Arrows>

      </View>
    );
  }

  onReport(){
    if(!this.props.post || this.props.post.invalid)
      return console.log("this.props.post is invalid")

    this.props.db.ref("ladderreports/"+this.props.room+"/"+this.props.post+"/"+this.props.user.uid)
    .set( this.props.firebase.database.ServerValue.TIMESTAMP )
    .then(() => Alert.alert("Success", "We have received you report and will review it asap"))
    .catch(err => {
      console.log("Failed to report: ", err)
      Alert.alert("Failed to report", "If you have reported this submission before, this is normal. If not, please try again")
    })
  }

  onVote(){
    if(!this.props.post || this.props.post.invalid)
      return console.log("this.props.post is invalid")
    this.setState({ voted: true })

    const voteRef = this.props.db.ref("laddervotes/"+this.props.room+"/"+this.props.post.key+"/"+this.props.user.uid)
    voteRef.set( this.props.firebase.database.ServerValue.TIMESTAMP )
    .catch(err => {
      console.log("Failed to vote: ", err)
      this.setState({ voted: false })
    })
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
