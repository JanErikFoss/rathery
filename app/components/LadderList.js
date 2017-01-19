import React, { Component } from 'react';
import { StyleSheet, View, ListView, Text } from 'react-native';

import LadderListLoader from "./LadderListLoader"
import LadderListItem from "./LadderListItem"

export default class LadderListTop extends Component {
  constructor(props) {
    super(props);

    this.rows = [];
    const startingRows = [{loading: true, op1: "Loading...", op2: "Loading..."}];

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      ds: ds.cloneWithRows(startingRows),
      loadMax: props.loadMax || 20,
    };

  }

  componentDidMount(){
    this.props.firebase.auth().onAuthStateChanged( user=> {
      if(!user) return console.log("LadderList.js: Failed to initialize ladder, user is null");

      this.uid = user.uid;

      const ref = this.props.db.ref("ladders/"+this.props.room);
      const query = this.props.new
        ? ref.orderByChild("createdAt").limitToLast(this.state.loadMax)
        : ref.orderByChild("votes").limitToLast(this.state.loadMax);

      this.listener = query.on("child_added", ss=>{
        let listener = ss.ref.on("value", ss => this._onChildAdded({listener, ss}),
          err=> console.log("Failed to listen for value in LadderList.js: ", err) );
      }, err=> console.log("Failed to listen for child_added in LadderList.js: ", err) );

    });
  }

  _onChildAdded({listener, ss}){
    if(this.unmounted) return console.log("Unmounted, disregarding child_added in LadderList.js");
    let row = ss.val() || {};

    row.id = ss.key;
    row.votes = row.votes || 0;
    row.removeListener = ()=> ss.ref.off("value", listener);

    //If new data is null, remove row if it already exists then return
    if(!ss.exists()){
      row.removeListener();
      this.rows = this.rows.filter( r=> r.id !== row.id );
      this.setState(prev =>{
        return {ds: prev.ds.cloneWithRows( this.rows ) }
      });
      return;
    }

    //Check if user has voted and assign voted=true if true
    const old = this.rows.find( r=> r.id === row.id );
    old && old.voted && ( row = Object.assign({}, row, {voted: true}) )

    //Remove old row
    this.rows = this.rows.filter( r => r.id !== row.id );

    //Insert new row
    const sortBy = this.props.new ? "createdAt" : "votes";
    const index = this.rows.findIndex( r=> r[sortBy] < row[sortBy])
    index === -1 ? this.rows.push(row) : this.rows.splice(index, 0, row);

    //Get the overflowing rows
    const overflowRows = this.rows.slice(this.state.loadMax);
    //Get the new rows array
    this.rows = this.rows.slice(0, this.state.loadMax);

    this.setState(prev =>{
      //Update listview with new row
      return {ds: prev.ds.cloneWithRows( this.rows ) }
    }, ()=>{ //Callback
      //Load vote if not explicitly set to true
      !row.voted && this.loadVotedFor( row )
    });

    //Remove listener on the overflowing rows
    overflowRows.forEach( r=> r.removeListener() );
  }

  loadVotedFor(row){
    const ref = this.props.db.ref("laddervotes/"+this.props.room+"/"+row.id+"/"+this.uid);
    ref.once("value", 
      ss => ss.exists() && this.changeRow(row, {voted: true}), 
      err=> console.log("Failed to load vote for ladder question: ", err));
  }

  changeRow(row, newProps){
    if(this.unmounted) return console.log("Unmounted, disregarding changeRow call in LadderList.js");
    /*let changed = false;
    Object.keys(newProps).forEach( key => changed = changed || newProps[key] !== row[key] );
    if(!changed) return console.log("changeRow called with no changes to be done"); */

    //Copy newRow and set the new properties
    const newRow = Object.assign({}, row, newProps);
    //Create a copy of rows
    this.rows = [...this.rows];

    //Replace old row with new row in newRows array
    this.rows[this.rows.indexOf(row)] = newRow;

    this.setState(prevState => {
      return {ds: prevState.ds.cloneWithRows(this.rows) } //Set listview data to newRows
    });
  }

  onVote(rowData){
    if(!rowData.id) return console.log("Invalid id");
    if(rowData.voted) return console.log("Already voted");
    console.log("Voting for id " + rowData.id);
    this.changeRow(rowData, {voted: true});

    const voteRef = this.props.db.ref("laddervotes/"+this.props.room+"/"+rowData.id+"/"+this.uid);
    const laddRef = this.props.db.ref("ladders/"+this.props.room+"/"+rowData.id+"/votes");

    voteRef.set( this.props.firebase.database.ServerValue.TIMESTAMP )
    .then( () => console.log("Vote record saved") )
    .then( () => laddRef.transaction(votes=> votes ? ++votes : 1) )
    .then( () => console.log("Successfully completed laddervote action") )
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
    backgroundColor: "#34495e",
  },

});