import React, { Component } from 'react';
import { StyleSheet, View, ListView, Text, Dimensions, Keyboard, Platform } from 'react-native';

import ChatItem from "./ChatItem";
import ChatHeader from "./ChatHeader"

import { GiftedChat, Actions } from '../../modified-repos/gifted-chat';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      uid: "loading user id...",
      name: "loading username..."
    };
  }

  componentWillMount() {

    this.props.firebase.auth().onAuthStateChanged( user=> {
      if(!user) return console.log("Chat.js: Failed to initialize game, user is null");

      this.setState({uid: user.uid});

      this.props.db.ref("users/"+user.uid+"/name").on("value", ss=> {
        this.setState({name: ss.val() || "Some user"});
      });

      this.props.db.ref("chats/main").limitToLast(1).on("child_added", ss=>{
        const message = ss.val();
        //console.log("Message received: ", message);

        this.setState(prevState => {
          return { messages: GiftedChat.append(prevState.messages, message) };
        });

      });

    });

    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hey, welcome back!",
          createdAt: Date.now(),
          user: {
            _id: 2,
            name: 'Rathery',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    });

  }

  onSend(messages = []) {
    Keyboard.dismiss();

    const message = messages[messages.length - 1];
    message._id = this.props.db.ref("chats/main").push().key;

    //console.log("Saving message: ", message);

    this.props.db.ref("chats/main/"+message._id).set(message);
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          style={styles.chat}
          messages={this.state.messages}
          onSend={this.onSend.bind(this)}
          user={{ 
            _id: this.state.uid,
            name: this.state.name,
            avatar: 'https://facebook.github.io/react/img/logo_og.png', 
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
  }

});