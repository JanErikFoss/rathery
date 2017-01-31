import React, { Component } from 'react';
import { StyleSheet, View, ListView, Text, Dimensions, Keyboard, Platform, Alert } from 'react-native';

import ChatItem from "./ChatItem";
import ChatHeader from "./ChatHeader"

import { GiftedChat, Actions } from '../../modified-repos/gifted-chat';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      uid: "loading user id...",
      name: "Some user",
      maxLength: this.props.maxLength || 80
    };
  }

  componentWillMount() {
    this.props.db.ref("users/"+this.props.user.uid+"/name").once("value")
    .then(ss=> ss.val() && this.setState({name: ss.val()}) )
    .catch(err=> console.log("Failed to get name in Chat.js: ", err) )

    this.props.db.ref("chats/main").limitToLast(1).on("child_added", ss=>{
      this.setState(prevState => {
        return { messages: GiftedChat.append(prevState.messages, ss.val()) };
      });
    });
  }

  onSend(messages = []) {
    this.props.dismissOnSend && Keyboard.dismiss();

    const message = messages[messages.length - 1];
    message._id = this.props.db.ref("chats/main").push().key;

    if(!message.text) return console.log("Not sending empty message");
    if(message.text.length > this.state.maxLength) 
      return Alert.alert("Too long", "Max length is "+this.state.maxLength+" characters", [{text: "ok"}]);

    this.props.db.ref("chats/main/"+message._id).set(message)
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
            name: this.state.name,
            avatar: require("../../images/appicon.png"), 
          }}
          isAnimated={true} 
          renderActions={this.renderCustomActions}
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