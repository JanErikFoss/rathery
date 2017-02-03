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
      maxLength: this.props.maxLength || 140,
      room: this.props.room || "main",
    };
  }

  componentWillMount() {
    this.chatRef = this.props.db.ref("chats/"+this.state.room);
    this.chatRef.limitToLast(1).on("child_added", ss=>{
      this.setState(prevState => {
        return { messages: GiftedChat.append(prevState.messages, ss.val()) };
      });
    });

    const userRef = this.props.db.ref("users/"+this.props.user.uid);

    this.nickRef = userRef.child("nickname");
    this.nickRef.on("value", ss=> this.setState({nick: ss.val()}) )

    this.avaRef = userRef.child("avatar");
    this.avaRef.on("value", ss=> this.setState({avatar: ss.val()}) )
  }

  componentWillUnmount(){
    this.chatRef && this.chatRef.off();
    this.nickRef && this.nickRef.off();
    this.avaRef && this.avaRef.off();
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

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          style={styles.chat}
          messages={this.state.messages}
          onSend={this.onSend.bind(this)}
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