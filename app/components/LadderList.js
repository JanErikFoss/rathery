import React, { Component } from 'react';
import { StyleSheet, View, ListView, Text } from 'react-native';

import LadderListLoader from "./LadderListLoader"
import LadderListItem from "./LadderListItem"

export default class LadderList extends Component {
  constructor(props) {
    super(props);

    this.rows = [{loading: true, op1: "Loading...", op2: "Loading..."}];
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      ds: ds.cloneWithRows(this.rows),
      loadMax: props.loadMax || 20,
    };

  }

  componentDidMount(){
    this.value_count = 0;

    this.props.firebase.auth().onAuthStateChanged( user=> {
      if(!user) return console.log("LadderList.js: Failed to initialize ladder, user is null");

      this.uid = user.uid;

      this.ref = this.props.db.ref("ladders/main");
      const query = this.ref.orderByChild("votes").limitToLast(this.state.loadMax);
      this.listener = query.on("child_added", ss=>{
        let listener = ss.ref.on("value", 
          ss => this._onChildAdded({listener, ss}), 
          err=> console.log("Failed to listen for value in LadderList.js: ", err) );
      }, err=> console.log("Failed to listen for child_added in LadderList.js: ", err) );

    });
  }

  _onChildAdded({listener, ss}){
    if(this.unmounted) return console.log("Unmounted, disregarding child_added in LadderList.js");
    let row = ss.val();
    if(!row){
      ss.ref.off("value", listener);
      this.rows = this.rows.filter( r => r.id !== ss.key );
      this.setState(prev =>{
        return {ds: prev.ds.cloneWithRows( this.rows ) }
      });
      return;
    }

    row.id = ss.key;
    row.votes = row.votes || 0;
    row.removeListener = ()=> ss.ref.off("value", listener);

    //console.log("Top question changed: ", row);

    this._votedFor(row) 
      ? row = Object.assign({}, row, {voted: true} )
      : this.loadVotedFor(row);

    this.rows = this.rows.filter( r => r.id !== row.id && !r.loading );

    this._insertRow(row);

    const overflowRows = this.rows.slice(this.state.loadMax);
    this.rows = this.rows.slice(0, this.state.loadMax);
      
    this.setState(prev =>{
      return {ds: prev.ds.cloneWithRows( this.rows ) }
    });

    overflowRows.forEach( row => row.removeListener() );
  }

  _votedFor(row){
    let votedFor = false;
    this.rows.forEach( r => votedFor = (r.id === row.id) ? r.voted : votedFor );
    return votedFor;
  }

  _insertRow(row){
    this.rows = [...this.rows];

    for(let i = 0; i < this.rows.length; ++i)
      if(row.votes >= this.rows[i].votes)
        return this.rows.splice(i, 0, row);

    this.rows.push(row);
  }

  loadVotedFor(row){
    const ref = this.props.db.ref("laddervotes/main/"+row.id+"/"+this.uid);
    ref.once("value", 
      ss => ss.exists() && this.changeRow(row, {voted: true}), 
      err=> console.log("Failed to load vote for ladder question: ", err));
  }

  changeRow(row, newProps){
    if(this.unmounted) return console.log("Unmounted, disregarding changeRow call in LadderList.js");
    /*let changed = false;
    Object.keys(newProps).forEach( key => changed = changed || newProps[key] !== row[key] );
    if(!changed) return console.log("changeRow called with no changes to be done"); */

    const newRow = Object.assign({}, row, newProps);      //Copy newRow and set the "voted" property to true
    this.rows = [...this.rows];                           //Create a copy of rows

    this.rows[this.rows.indexOf(row)] = newRow;           //Replace old row with new row in newRows array

    this.setState(prevState => {
      return {ds: prevState.ds.cloneWithRows(this.rows) } //Set listview data to newRows
    });
  }

  onVote(rowData){
    if(!rowData.id) return console.log("Invalid id");
    if(rowData.voted) return console.log("Already voted");
    console.log("Voting for id " + rowData.id);
    this.changeRow(rowData, {voted: true});
    this.props.db.ref("laddervotes/main/"+rowData.id+"/"+this.uid).set( true )
    .then( () => console.log("Vote saved") )
    .catch(err=>{
      console.log("Failed to vote: ", err);
      this.changeRow(rowData, {voted: false});
    });
  }

  componentWillUnmount(){
    this.ref && this.ref.off();
    this.rows && this.rows.forEach( row => row.removeListener && row.removeListener() );

    this.unmounted = true;
  }

  render() {
    return (
      <View style={styles.container}>

        <ListView style={styles.listView}
          dataSource={this.state.ds}
          renderRow={this.renderRow.bind(this)} />

      </View>
    );
  }

  renderRow(rowData){
    return (
      <View>
        {rowData.loading
          ? <LadderListLoader />
          : <LadderListItem 
              data={rowData} 
              onVote={this.onVote.bind(this)} />
        }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});