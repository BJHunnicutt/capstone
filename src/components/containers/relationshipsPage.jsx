import React from 'react';
// import store from '../../store';
import { connect } from 'react-redux';
import '../../styles/relationships.css';
import d3 from 'd3'
import allData from '../data/test.csv'

import RelationshipsDiagram from '../views/relationships.js'


class RelationshipsPage extends React.Component {
	constructor(props){
    super(); // "To get our context"
    this.state = {
      data: [],
    }
  }

	componentDidMount() {
		d3.csv(allData, (data) => {
			console.log('d3csv: ', data);
			this.setUpRelationships(data);
		});

	}

	setUpRelationships(data) {
		console.log('outsided3csv: ', data);



	}

	render () {


  	return (

      <RelationshipsDiagram />
    );
  }
}



const mapStateToProps = function(store) {
  return {
    query: store.searchState.selectedQuery.query,
    searchHistory: store.searchState.searchHistory,
    totalItems: store.searchState.currentResults,
    data: store.scatterState.dataBar,

  };
}
export default connect(mapStateToProps)(RelationshipsPage);
