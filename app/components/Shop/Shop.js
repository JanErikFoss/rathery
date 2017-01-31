import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, Dimensions, ListView } from 'react-native';

import GridItem from "./GridItem"

export default class Shop extends Component {
  constructor(props){
    super();

    this.listenerOffs = [];

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const initialRows = [{title: "Loading", loading: true}];

    this.state = {
      lobbyState: 0,
      ds: ds.cloneWithRows(initialRows)
    };

  }

  componentWillMount(){
    this.props.firebase.auth().onAuthStateChanged( user=> {
      if(!user) return console.log("Shop.js: Failed to initialize game, user is null");

      this.uid = user.uid;

      this.props.db.ref("shop").once("value", shopSS => {
        this.rows = [];

        shopSS.val().forEach( (row, index) => {
          if(!row) return console.log("Invalid shop item at index " + index);
          row.index = index;
          this.rows.push(row);

          const ref = this.props.db.ref("users/"+this.uid+"/inventory/"+row.index);
          const lis = ref.on("value", 
            ss => this.boughtStatusChanged({row, bought: ss.val()}), 
            err=> console.log("users/$uid/inventory/$index value listener failed in Shop.js: ", err) );
        
          this.listenerOffs.push( ()=> ref.off("value", lis) );
        });

      }, err=> console.log("Failed to get shop value in Shop.js: ", err) );

    });
  }

  componentWillUnmount(){
    this.listenerOffs.forEach( off=> off && off() );
    this.unmounted = true;
  }

  boughtStatusChanged({row, bought}){
    if(this.unmounted) return console.log("Unmounted, disregarding boughtStatusChanged in Shop.js");
    //console.log("Index is " + row.index + " and rows is ", this.rows);
    this.rows = this.rows.filter( row=> !row.loading );

    this.changeRow(row, {buying: false, bought});
  }

  render() {
    return (
      <View style={styles.container}>

          <ListView style={styles.listView}
            contentContainerStyle={styles.listContent}
            dataSource={this.state.ds}
            renderRow={this.renderRow.bind(this)}
            removeClippedSubviews={false}
          />

      </View>
    );
  }

  renderRow(row){
    return (
      <GridItem
          data={row} {...this.props}
          onPress={this.onPress.bind(this)} />
    );
  }

  onPress(row){
    console.log("Score: " + this.props.score);
    if(row.bought) return console.log("Already bought");
    if(!row.active) return console.log("Row is inactive");
    if(this.props.score < row.cost) return console.log("Cannot afford that item");

    this.changeRow(row, {buying: true});

    this.props.db.ref("shopactions").push({
      uid: this.uid,
      item: row.index
    })
    .then( () => console.log("Shop action successful") )
    .catch(err=> console.log("Shop action failed in Shop.js: ", err) );
  }

  changeRow(row, newProps){
    if(this.unmounted) return console.log("Unmounted, disregarding changeRow in Shop.js");
    if(!row) return console.log("Failed to change row, row was invalid");
    if(!newProps) return console.log("Failed to change row, newProps was invalid");
    this.rows = [...this.rows];                               //Copy this.rows to maintain immutability
    this.rows[row.index-1] = Object.assign({}, row, newProps);//Assign props in immutable way
    this.setState(prev => {                                   //Set new state
      return {ds: prev.ds.cloneWithRows(this.rows)};
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495e",
  },

  listView: {
    flex: 1,
    paddingTop: 4,
  },

  listContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }


});