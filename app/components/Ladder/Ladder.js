import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Alert, TouchableHighlight, Image } from 'react-native';

import PostView from "./PostView"

export default class Ladder extends Component {
  constructor(props) {
    super(props);

    this.defaultPost = {
      op1: "No posts to show",
      op2: "",
      isDefaultPost: true,
    };

    this.state = {
      room: this.props.room || "main",
      index: this.props.index || 1,
      post: this.defaultPost,
      loading: true,
      showNew: this.props.showNew || false,
    };

    this.getTitle = this.getTitle.bind(this);
  }

  getTitle(){
    return this.state.showNew ? "New submissions" : "Best submissions";
  }

  componentDidMount(){
    this.reload();
  }

  reload(){
    console.log("Reloading");
    this.setState({loading: true});
    this.loadPost(this.state.index)
    .then(post => this.setState({post}) )
    .then( ()  => console.log("Post loaded") )
    .catch( console.log )
    .then(()=> this.setState({loading: false}) );
  }

  getNewPost(index){
    if(this.state.post.isDefaultPost) return console.log("No posts to show");
    if(this.state.loading) return console.log("Still loading...");
    if(index <= 0) return console.log("Invalid index: " + index);

    //We need to keep track of the old key to check if we're returned the same row
    this.defaultPost.key = this.state.post.key;

    const oldIndex = this.state.index, oldPost = this.state.post;
    this.setState({post: this.defaultPost, index, loading: true});

    this.loadPost(index)
    .then(post=> post.key === this.state.post.key ? Promise.reject("Same post returned") : post )
    .then(post=> this.setState({post}) )
    .then(()=> console.log("New post loaded and displayed") )
    .then(()=> this.setState({loading: false}) )
    .catch(err=>{
      console.log("Failed to load post at index " + index + ": " + err.message);

      if(err === "Same post returned"){
        this.setState({post: oldPost, index: oldIndex, loading: false});
      }else if(err === "No posts to show"){
        if(index === 1){
          console.log("Index is one, so there really is no posts to show");
          const errPost = {op1: "No posts available", op2: " "};
          this.setState({post: errPost, voted: false, votes: "..."});
        }else{
          console.log("Setting index to one and reloading");
          this.setState({post: defaultPost, index: 1}, this.reload);
        }
      }else{
        this.setState({post: oldPost, index: oldIndex, loading: false});
      }
    })
  }

  loadPost(index){
    console.log("Loading post at index " + index);

    const roomRef = this.props.db.ref("ladders/"+this.state.room);
    const orderBy = this.state.showNew ? "createdAt" : "votes";
    const query = roomRef.orderByChild(orderBy).limitToLast(index);

    const checkLength = ss=> ss.numChildren() > 0 ? ss : Promise.reject("No posts to show");

    const getFirst = ss=>{
      let post;
      ss.forEach(p=>{
        post = {key: p.key, ...p.val()}; 
        return true;        // return true to break forEach
      });
      return post;
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
      .catch( reject );
    });
  }

  componentWillUnmount(){
    this.removeChildAddedListener && this.removeChildAddedListener();
    this.removeChildAddedListener = null;
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
      rightActive: true,//this.state.index < this.state.endIndex,
      onBackPressed: ()=> this.getNewPost(this.state.index-1),
      onForwardPressed: ()=> this.getNewPost(this.state.index+1),
    };
  }

  render() {
    return (
      <View style={styles.container}>

        <PostView {...this.getProps()} new={this.state.showNew} />

        <TouchableHighlight style={styles.highlight}
            onPress={this.changeState.bind(this)} underlayColor={"transparent"}>
          <Image source={this.state.showNew
            ? require("../../images/best.png")
            : require("../../images/new.png")} style={styles.image}/>
        </TouchableHighlight>

      </View>
    );
  }

  changeState(){
    this.defaultPost.key = null;

    this.setState(prev=> {
      return {showNew: !prev.showNew, index: 1, post: this.defaultPost};
    }, ()=>{
      this.props.titleChanged();
      this.getNewPost(1);
    });
  }

}

const imageSize = 50;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495e"
  },

  highlight: {
    padding: 5,
    alignItems: "center",
  },
  image: {
    height: imageSize,
    width: imageSize,
  }

});