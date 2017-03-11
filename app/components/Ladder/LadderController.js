import React, { Component } from 'react';
import { View } from 'react-native';

import PostView from "./PostView"

export default class LadderController extends Component {
  constructor(props) {
    super(props);

    this.loadingPost = {
      op1: "Loading",
      op2: "Loading",
    }

    this.state = {
      room: this.props.room || "main",
      index: this.props.index || 1,
      endIndex: Number.MAX_SAFE_INTEGER,
      post: this.loadingPost,
      loading: true,
    };

  }

  componentDidMount(){
    this.loadPost(this.state.index)
    .then(post => this.setState({post}) )
    .then( ()  => console.log("Post loaded") )
    .catch( console.log )
    .then( ()  => this.setState({loading: false}) );
  }

  getNewPost(index){
    const validIndex = i=> i > 0 && i <= this.state.endIndex;
    if(!validIndex(index)) return console.log("Invalid index: " + index);

    const oldIndex = this.state.index;
    const oldPost = this.state.post;
    this.loadingPost.key = oldPost.key;
    this.setState({post: this.loadingPost, index, loading: true});

    this.loadPost(index)
    .then(post=> this.setState({post, loading: false}) )
    .then(()=> console.log("New post loaded and displayed") )
    .catch(err=>{
      console.log(err);
      this.setState({post: oldPost, index: oldIndex, loading: false});
    });
  }

  loadPost(index){
    console.log("Loading post at index " + index);

    const roomRef = this.props.db.ref("ladders/"+this.state.room);
    const orderBy = this.props.new ? "createdAt" : "votes";
    const query = roomRef.orderByChild(orderBy).limitToLast(index);

    const checkLength = ss=> ss.numChildren() > 0 ? ss : Promise.reject("No posts to show");

    const getFirst = ss=>{
      let post;
      ss.forEach(p=>{
        post = {key: p.key, ...p.val()};
        return true;        // return true to break forEach
      });
      return post.key === this.state.post.key
        ? Promise.reject("Same post returned")
        : post;
    };

    const printSS = ss=> {
      ss.forEach(p=> console.log(p.val()));
      return ss;
    }

    return new Promise( (resolve, reject)=>{
      query.once("value")
      //.then( printSS )
      .then( checkLength )
      .then( getFirst )
      .then( resolve )
      .catch(err=> {
        if(err !== "Same post returned") return reject("Failed to load post at index " + index + ": " + err);
        this.setState({endIndex: index-1});
        return reject("Failed to load post at index " + index + ": " + err);
      });
    });
  }

  onBackPressed(){
    this.getNewPost(this.state.index-1);
  }
  onForwardPressed(){
    this.getNewPost(this.state.index+1);
  }

  componentWillUnmount(){

  }

  getProps(){
    return {
      ...this.props,
      new: this.state.showNew,
      index: this.state.index,
      post: this.state.post,
      room: this.state.room,
      loading: this.state.loading,
      leftActive: this.state.index > 1,
      rightActive: this.state.index < this.state.endIndex,
      onBackPressed: this.onBackPressed.bind(this),
      onForwardPressed: this.onForwardPressed.bind(this),
    };
  }
}
