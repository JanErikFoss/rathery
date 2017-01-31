import React, { Component } from 'react';
import { StyleSheet, View, Navigator, Text, TouchableHighlight, Image, Platform, Keyboard } from 'react-native';

import Lobby from "./Lobby"
import Shop from "./Shop/Shop"
import Ladder from "./Ladder/Ladder"
import WritePage from "./Ladder/WritePage"

export default class MyNavigator extends Component {

  componentWillMount(){

    this.initialRouteIndex = 1;

    this.routes = [
      {
        index: 0, 
        title: ()=> this.getTitle("$" + (this.props.score || 0)), 
        render: (route, nav)=> this.renderScene(( 
          <Shop {...this.props} {...this.getProps({route, nav})} /> 
        )),
        left: (route, nav, index, navState)=> this.getButton({
          image: require("../images/back.png"), 
          onPress: ()=> nav.jumpTo(this.routes[ index+1 ])
        }),
        right: ()=> null,
      },

      {
        index: 1, 
        title: ()=> this.getTitle("$" + (this.props.score || 0)), 
        render: (route, nav)=> this.renderScene(( 
          <Lobby {...this.props} {...this.getProps({route, nav})} /> 
        )),
        left: (route, nav, index, navState)=> this.getButton({
          image: require("../images/cash.png"), 
          onPress: ()=> nav.jumpTo(this.routes[ index-1 ])
        }),
        right: (route, nav, index, navState)=> this.getButton({
          image: require("../images/ladder.png"), 
          onPress: ()=> nav.jumpTo(this.routes[ index+1 ])
        }),
      },

      {
        index: 2,
        title: ()=> this.getTitle(this.ladderTitleRef ? this.ladderTitleRef() : "Submissions"),  
        render: (route, nav)=> this.renderScene(( 
          <Ladder {...this.props} {...this.getProps({route, nav})} 
            titleRef={ref=> this.ladderTitleRef = ref} 
            titleChanged={this.forceUpdate.bind(this)} /> 
        )),
        left: (route, nav, index, navState)=> this.getButton({
          image: require("../images/back.png"), 
          onPress: ()=> nav.jumpTo(this.routes[ index-1 ])
        }),
        right: (route, nav, index, navState)=> this.getButton({
          image: require("../images/write.png"), 
          onPress: ()=> nav.jumpTo(this.routes[ index+1 ])
        }),
      },

      {
        index: 3, 
        title: ()=> this.getTitle("Would you..."), 
        render: (route, nav)=> this.renderScene(( 
          <WritePage {...this.props} {...this.getProps({route, nav})} 
            onFinishPressedRef={ref=> this.onWriteFinishPressed = ref} /> 
        )),
        left: (route, nav, index, navState)=> this.getButton({
          image: require("../images/back.png"), 
          onPress: ()=> nav.jumpTo(this.routes[ index-1 ])
        }),
        right: (route, nav, index, navState)=> this.getButton({
          image: require("../images/checkmark.png"), 
          onPress: ()=> this.onWriteFinishPressed && this.onWriteFinishPressed()
        }),
      },

    ];
  }

  render() {
    return (
      <Navigator style={styles.nav}
          initialRoute={this.routes[this.initialRouteIndex]}
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
      <TouchableHighlight style={styles.buttonHighlight}
          underlayColor={"transparent"}
          onPress={()=>{
            Keyboard.dismiss();
            onPress && onPress();
          }}>
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

  getProps({route, nav}){
    return {
      routes: this.routes,
      route: route,
      navigator: nav,
      height: 240
    };
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