import React, { Component } from 'react';
import { StyleSheet, View, Navigator, Text, TouchableHighlight, Image, Platform } from 'react-native';

import Lobby from "./Lobby"
import Shop from "./Shop/Shop"
import Ladder from "./Ladder/Ladder"
import WritePage from "./Ladder/WritePage"

export default class MyNavigator extends Component {

  componentWillMount(){
    this.routes = [
      {
        index: 0, 
        render: (route, nav)=> this.renderScene(( <Shop {...this.props} routes={this.routes} route={route} navigator={nav}/> )),
        title: ()=> this.getTitle("$" + (this.props.score || 0)), 
        left: (route, nav, index, navState)=> this.getButton({
          image: require("../images/back.png"), 
          onPress: ()=> nav.jumpTo(this.routes[1]),
        }),
        right: ()=> null,
      },

      {
        index: 1, 
        render: (route, nav)=> this.renderScene(( <Lobby {...this.props} routes={this.routes} route={route} navigator={nav}/> )),
        title: ()=> this.getTitle("$" + this.props.score || 0), 
        left: (route, nav, index, navState)=> this.getButton({
          image: require("../images/cash.png"), 
          onPress: ()=> nav.jumpTo(this.routes[0])
        }),
        right: (route, nav, index, navState)=> this.getButton({
          image: require("../images/ladder.png"), 
          onPress: ()=> nav.jumpTo(this.routes[2])
        }),
      },

      {
        index: 2, 
        render: (route, nav)=> this.renderScene(( <Ladder {...this.props} routes={this.routes} route={route} navigator={nav} titleRef={ref=> this.ladderTitleRef = ref} titleChanged={this.forceUpdate.bind(this)}/> )),
        title: ()=> this.getTitle(this.ladderTitleRef ? this.ladderTitleRef() : "Submissions"), 
        left: (route, nav, index, navState)=> this.getButton({
          image: require("../images/back.png"), 
          onPress: ()=> nav.jumpTo(this.routes[1])
        }),
        right: (route, nav, index, navState)=> this.getButton({
          image: require("../images/write.png"), 
          onPress: ()=> nav.jumpTo(this.routes[3])
        }),
      },

      {
        index: 3, 
        render: (route, nav)=> this.renderScene(( <WritePage {...this.props} routes={this.routes} route={route} navigator={nav} onFinishPressedRef={ref=> this.onWriteFinishPressed = ref} /> )),
        title: ()=> this.getTitle("Would you..."), 
        left: (route, nav, index, navState)=> this.getButton({
          image: require("../images/back.png"), 
          onPress: ()=> nav.jumpTo(this.routes[2])
        }),
        right: (route, nav, index, navState)=> this.getButton({
          image: require("../images/checkmark.png"), 
          onPress: ()=> {
            console.log("Right button pressed");
            this.onWriteFinishPressed && this.onWriteFinishPressed();
          }
        }),
      },



    ];
  }

  render() {
    return (
      <Navigator style={styles.nav}
          initialRoute={this.routes[1]}
          initialRouteStack={this.routes}
          renderScene={(route, nav)=> route.render(route, nav)}
          navigationBar={this.renderNavBar()} />
    );
  }

  renderNavBar(){
    return(
      <Navigator.NavigationBar
         routeMapper={{
           LeftButton: (route, nav, index, navState) => route.left(route, nav, index, navState),
           RightButton: (route, nav, index, navState) => route.right(route, nav, index, navState),
           Title: (route, nav, index, navState) => route.title(route, nav, index, navState),
         }}
         style={styles.navBar}
       />
    );
  }

  getButton({image, onPress}){
    return(
      <TouchableHighlight onPress={onPress} underlayColor={"transparent"} style={styles.buttonHighlight}>
        <Image source={image} style={styles.buttonImage} />
      </TouchableHighlight>
    );
  }

  getTitle(text){
    return (
      <View style={{flex: 1, justifyContent: "center"}}>
        <Text style={{color: "white", fontSize: 20}}>{text}</Text>
      </View>
    );
  }

  renderScene(scene){
    return (
      <View style={{paddingTop: Platform.OS === 'ios' ? 64 : 54, flex: 1}}>
        {scene}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  navigator: {
  },

  navBar: {
    backgroundColor: Platform.OS === 'ios' ? "transparent" : "#22313F",
  },

  buttonHighlight: {
    padding: 4,
    flex: 1,
    justifyContent: "center",
  },
  buttonImage: {
    width: 38,
    height: 38,
  }

});