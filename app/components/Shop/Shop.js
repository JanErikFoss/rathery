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
    this.props.db.ref("shop").once("value")
    .then( this.shopContentReceived.bind(this) )
    .catch(err=> console.log("Failed to get shop value in Shop.js: ", err) );

    this.avaRef = this.props.db.ref("users/"+this.props.user.uid+"/avatar");
    this.avaRef.on("value", ss=> this.avatarChanged(ss.val()) )
  }

  avatarChanged(avatar){
    this.rows = this.rows.map(row=> Object.assign({}, row));

    this.setState({
      avatar,
      ds: this.state.ds.cloneWithRows(this.rows)
    });
  }

  shopContentReceived(shopSS){
    this.rows = [];

    shopSS.val().forEach( (row, index) => {
      if(!row) return console.log("Invalid shop item at index " + index);
      row.index = index;
      this.rows.push(row);

      const ref = this.props.db.ref("users/"+this.props.user.uid+"/inventory/"+row.index);
      const lis = ref.on("value", 
        ss => this.boughtStatusChanged({row, bought: ss.val()}), 
        err=> console.log("users/$uid/inventory/$index value listener failed in Shop.js: ", err) );
    
      this.listenerOffs.push( ()=> ref.off("value", lis) );
    });
  }

  boughtStatusChanged({row, bought}){
    if(this.unmounted) return console.log("Unmounted, disregarding boughtStatusChanged in Shop.js");
    this.rows = this.rows.filter( row=> !row.loading );

    this.changeRow(row, {buying: false, bought});
  }

  componentWillUnmount(){
    this.listenerOffs.forEach( off=> off && off() );
    this.unmounted = true;

    this.avaRef && this.avaRef.off();
  }

  render() {
    return (
      <ListView style={styles.listView}
        contentContainerStyle={styles.listContent}
        dataSource={this.state.ds}
        renderRow={this.renderRow.bind(this)}
        removeClippedSubviews={false} />
    );
  }

  renderRow(row){
    console.log("Rerendering row "+row.index+" with avatar " + this.state.avatar);
    return (
      <GridItem 
          isCurrentAvatar={row.image && row.image === this.state.avatar}
          data={row} {...this.props}
          onPress={row=> row.bought ? this.activateAvatar(row) : this.buy(row)} />
    );
  }

  buy(row){
    if(this.props.score() < row.cost) return console.log("Cannot afford that item. Score: "+this.props.score() + ", Cost: "+row.cost);

    this.changeRow(row, {buying: true});

    this.props.db.ref("shopactions").push({
      uid: this.props.user.uid,
      index: row.index
    })
    .then( () => console.log("Shop action successful") )
    .catch(err=> console.log("Shop action failed in Shop.js: ", err) );
  }
  activateAvatar(row){
    if(row.image === this.state.avatar) return console.log("Already the active avatar");

    const avaRef = this.props.db.ref("users/"+this.props.user.uid+"/avatar");
    avaRef.set(row.image).then(()=> console.log("Activated avatar") )
    .catch(err=> console.log("Failed to activate avatar: ", err) );
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
  listView: {
    flex: 1,
    paddingTop: 4,
    backgroundColor: "#34495e",
  },

  listContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }


});