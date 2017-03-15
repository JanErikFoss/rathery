import React, { Component } from 'react';
import { StyleSheet, View, ListView, Text, Dimensions, Keyboard, Platform, Alert } from 'react-native';

import ChatItem from "./ChatItem";
import ChatHeader from "./ChatHeader"

import { GiftedChat, Actions } from '../../../modified-repos/gifted-chat';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      uid: "loading user id...",
      name: "Some user",
      maxLength: props.maxLength || 140,
      room: props.room || "main",
      initialMessageCount: props.initialMessageCount || 10
    };

    this.blockedUsers = []

    this.onSend = this.onSend.bind(this)
    this.onReport = this.onReport.bind(this)
    this.onMessage = this.onMessage.bind(this)
    this.onBlock = this.onBlock.bind(this)
    this.addBlocked = this.addBlocked.bind(this)
    this.listenForMessages = this.listenForMessages.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }

  componentWillMount() {
    const userRef = this.props.db.ref("users/"+this.props.user.uid)
    userRef.child("blocked").once("value")
    .then(ss => ss.forEach(this.addBlocked))
    .then( this.listenForMessages )
    .catch(err => {
      console.log("Failed to get block list or to listen for messages: ", err)
      Alert.alert("Failed to get messages", "Something went wrong while retrieving the chat messages")
    })

    this.nickRef = userRef.child("nickname")
    this.nickRef.on("value", ss=> this.setState({ nick: ss.val() }))

    this.avaRef = userRef.child("avatar");
    this.avaRef.on("value", ss=> this.setState({ avatar: ss.val() }))
  }

  addBlocked(ss){
    this.blockedUsers.push(ss.key)
  }

  listenForMessages(){
    const onErr = err => console.log("Failed to listen for messages in chat: ", err)
    this.chatRef = this.props.db.ref("chats/"+this.state.room);
    this.chatRef.limitToLast(this.state.initialMessageCount)
    .on("child_added", this.onMessage, onErr)
  }

  componentWillUnmount(){
    this.chatRef && this.chatRef.off()
    this.nickRef && this.nickRef.off()
    this.avaRef && this.avaRef.off()
  }

  onMessage(ss){
    const message = ss.val()
    if(this.blockedUsers.includes(message.user._id))
      return console.log("Message from blocked user was hidden")
    this.setState(prevState => {
      return { messages: GiftedChat.append(prevState.messages, message) }
    })
  }

  onSend(messages = []) {
    this.props.dismissOnSend && Keyboard.dismiss();
    if(!this.state.nick) return Alert.alert("Please wait...", "Your username has not loaded yet", [{text: "ok"}]);

    const message = messages[messages.length - 1];
    message._id = this.props.db.ref("chats/"+this.state.room).push().key;

    if(!message.text) return console.log("Not sending empty message");
    if(message.text.length > this.state.maxLength)
      return Alert.alert("Too long", "Max length is "+this.state.maxLength+" characters", [{text: "ok"}]);

    this.props.db.ref("chats/"+this.state.room+"/"+message._id).set(message)
    .then(()=> console.log("Successfully sent message") )
    .catch(err=> console.log("Failed to send message: ", err) );
  }

  onReport(message){
    this.props.db.ref("chatreports/"+this.state.room+"/"+message._id+"/"+this.props.user.uid)
    .set( this.props.firebase.database.ServerValue.TIMESTAMP )
    .then(() => console.log("Message reported as inappropriate"))
    .then(() => Alert.alert("Success", "We have heard you and will review the message"))
    .catch(err => {
      console.log("Failed to report message: ", err)
      Alert.alert("Failed to report message", "If you have reported this message before, this message is normal. If not, please try again.")
    })
  }

  onBlock(message){
    const uid = message.user._id
    if(uid === this.props.user.uid)
      return console.log("You tried to block yourself")
    console.log("Blocking user: ", uid)

    this.props.db.ref("users/"+this.props.user.uid+"/blocked/"+uid)
    .set(true)
    .then(() => this.state.messages.filter(mes => mes.user._id !== message.user._id))
    .then(messages => this.setState({ messages }))
    .catch(err => console.log("Failed to block user: ", err))
  }

  onRemove(message) {
    const messages = this.state.messages.filter(mes => mes._id !== message._id)
    this.setState({ messages })
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          style={styles.chat}
          messages={this.state.messages}
          onSend={this.onSend}
          onReport={this.onReport}
          onBlock={this.onBlock}
          onRemove={this.onRemove}
          user={{
            _id: this.props.user.uid,
            name: this.state.nick,
            avatar: this.state.avatar,
          }}
          isAnimated={true}
          showNameInsteadOfTime={true}
          forceLeft={false} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
  },

  chat: {

  }

});
