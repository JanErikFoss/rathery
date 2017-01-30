import React, { Component } from 'react';
import { StyleSheet, View, Navigator, Text, TouchableHighlight, Image, Platform } from 'react-native';

import Lobby from "./Lobby"
import Shop from "./Shop/Shop"
import Ladder from "./Ladder/Ladder"
import WritePage from "./Ladder/WritePage"

export default class MyNavigator extends Component {

  componentWillMount(){
    console.log("Navigator props: ", this.props);

    let ladderTitleRef;

    this.routes = [
      {
        index: 0, 
        render: (route, navigator)=> this.renderScene(( <Shop {...this.props} routes={this.routes} route={route} navigator={navigator}/> )),
        title: ()=> this.getTitle("$" + (this.props.score || 0)), 
        left: (route, navigator, index, navState)=> this.getButton({
          image: require("../images/back.png"), 
          onPress: ()=> navigator.jumpTo(this.routes[1]),
        }),
        right: ()=> null,
      },

      {
        index: 1, 
        render: (route, navigator)=> this.renderScene(( <Lobby {...this.props} routes={this.routes} route={route} navigator={navigator}/> )),
        title: ()=> this.getTitle("$" + this.props.score || 0), 
        left: (route, navigator, index, navState)=> this.getButton({
          image: require("../images/cash.png"), 
          onPress: ()=> navigator.jumpTo(this.routes[0])
        }),
        right: (route, navigator, index, navState)=> this.getButton({
          image: require("../images/ladder.png"), 
          onPress: ()=> navigator.jumpTo(this.routes[2])
        }),
      },

      {
        index: 2, 
        render: (route, navigator)=> this.renderScene(( <Ladder {...this.props} routes={this.routes} route={route} navigator={navigator} titleRef={ref=> ladderTitleRef = ref} titleChanged={this.forceUpdate.bind(this)}/> )),
        title: ()=> this.getTitle(ladderTitleRef ? ladderTitleRef() : "Submissions"), 
        left: (route, navigator, index, navState)=> this.getButton({
          image: require("../images/back.png"), 
          onPress: ()=> navigator.jumpTo(this.routes[1])
        }),
        right: (route, navigator, index, navState)=> this.getButton({
          image: require("../images/write.png"), 
          onPress: ()=> navigator.jumpTo(this.routes[3])
        }),
      },

      {
        index: 3, 
        render: (route, navigator)=> this.renderScene(( <WritePage {...this.props} routes={this.routes} route={route} navigator={navigator}/> )),
        title: ()=> this.getTitle("Would you..."), 
        left: (route, navigator, index, navState)=> this.getButton({
          image: require("../images/back.png"), 
          onPress: ()=> navigator.jumpTo(this.routes[2])
        }),
        right: (route, navigator, index, navState)=> null,
      },



    ];
  }

  render() {
    return (
      <Navigator style={styles.navigator}
          initialRoute={this.routes[1]}
          initialRouteStack={this.routes}
          renderScene={(route, navigator)=> route.render(route, navigator)}
          navigationBar={this.renderNavBar()} />
    );
  }

  renderNavBar(){
    return(
      <Navigator.NavigationBar
         routeMapper={{
           LeftButton: (route, navigator, index, navState) => route.left(route, navigator, index, navState),
           RightButton: (route, navigator, index, navState) => route.right(route, navigator, index, navState),
           Title: (route, navigator, index, navState) => route.title(route, navigator, index, navState),
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