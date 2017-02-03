import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Alert, TouchableHighlight, Image } from 'react-native';

import PostView from "./PostView"

export default class Ladder extends Component {
  constructor(props) {
    super(props);

    this.defaultPost = {
      op1: "No posts to show",
      op2: "No posts to show",
      isDefaultPost: true,
      invalid: true,
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

  getNewPost(index, ignoreChecks){
    if(!ignoreChecks){
      if(this.state.loading) return console.log("Still loading...");
      if(index <= 0) return console.log("Invalid index: " + index);
    }

    oldPost = this.state.post;
    this.defaultPost.key = oldPost.key;
    this.setState({post: this.defaultPost, loading: true});

    const checkSameAsOld = post=> post.key === oldPost.key ? Promise.reject({message: "Same post returned"}) : post;
    const updateState = post=> this.setState({post, index: Math.min(this.maxLength, index)});
    const log = ()=> console.log("New post loaded and displayed");
    const errorHandler = err=> this.errorHandler({err, index, oldPost});
    const turnOffLoading = ()=> this.setState({loading: false});

    this.loadPost(index)
    .then( checkSameAsOld )
    .then( updateState )
    .then( log )
    .catch(errorHandler )
    .then( turnOffLoading );
  }

  errorHandler({err, index, oldPost}){
    console.log("Failed to load post at index " + index + ": " + err.message);

    err.message === "Same post returned" && 
      this.setState({post: oldPost, index: Math.min(this.maxLength, Math.min(this.state.index, index))});

    err.message === "No posts returned" && 
      this.setState({index: 1, voted: false});
  }

  loadPost(index){
    console.log("Loading post with index " + index);

    const roomRef = this.props.db.ref("ladders/"+this.state.room);
    const orderBy = this.state.showNew ? "createdAt" : "votes";
    const query = roomRef.orderByChild(orderBy).limitToLast(index);

    const saveLength = ss=> {this.maxLength = ss.numChildren(); return ss;};
    const checkLength = ss=> ss.numChildren() > 0 ? ss : Promise.reject({message: "No posts returned"});

    const getFirst = ss=>{
      let post;
      ss.forEach(p=>{
        post = {key: p.key, ...p.val()}; 
        return true;        // return true to break forEach
      });
      return post;
    };  

    return new Promise( (resolve, reject)=>{
      query.once("value")
      .then( saveLength )
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
      this.reload();
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