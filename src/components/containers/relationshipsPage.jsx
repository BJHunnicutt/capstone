import React from 'react';
// import store from '../../store';
import { connect } from 'react-redux';
import '../../styles/relationships.css';
import d3 from 'd3'
import allData from '../data/short_filtered.csv'
import $ from 'jquery'
import _ from 'lodash'
import store from '../../store';
import { GET_RELATIONSHIP_DATA } from '../../actions/actions'; //FAILED_SEARCH,

import RelationshipsDiagram from '../views/relationships.js'


class RelationshipsPage extends React.Component {
	constructor(props){
		// console.log("constructor");
    super(); // "To get our context"
    this.state = {
      data: store.getState().scatterState.graphData,
    }
  }

	componentWillMount() {
		console.log("componentWillMount");
		d3.csv(allData, (data) => {
			// console.log('d3csv: ', data);
			this.setUpRelationships(data);
		});
	}

	componentDidMount() {
		console.log('did mount');
	}

	setUpRelationships(data) {
		// console.log('outsided3csv: ', data);

		let nameNodes = {}
		let baseNode = {name: '', group: 0, type: '', published: 0, total: 0, fraction_published: 0}
		let sourceLinks = {}

		for (var i = 0; i < data.length; i++) {
			// If this is a drug study
			if (data[i].has_drug_intervention === "True") {
				// There can be multiple drugs separated by semicolons, this separates them into an array
				let drugs = (data[i].drugs).split(/;/).filter(function(n){ return n !== " " });
				let sponsor = (data[i].lead_sponsor).trim().toLowerCase();

				// Set up base values for Sponsors
				if (!nameNodes[sponsor]) {
					nameNodes[sponsor] = $.extend(true, {}, baseNode);
					nameNodes[sponsor].name = sponsor;
					nameNodes[sponsor].group = 2;
					nameNodes[sponsor].type = 'sponsor';
				}
				// Increment values for new and old
				if (data[i].is_overdue === "False") nameNodes[sponsor].published +=1;
				nameNodes[sponsor].total += 1;
				nameNodes[sponsor].fraction = nameNodes[sponsor].published/nameNodes[sponsor].total;

				for (let el of drugs) {
					let drug = el.trim().toLowerCase();
					// Set up base values for Drugs
					if (!nameNodes[drug]) {
						nameNodes[drug] = $.extend(true, {}, baseNode);
						nameNodes[drug].name = drug;
						nameNodes[drug].group = 1;
						nameNodes[drug].type = 'drug';
					}
					// Increment values for new and old
					if (data[i].is_overdue === "False") nameNodes[drug].published +=1;
					nameNodes[drug].total += 1;
					nameNodes[drug].fraction = nameNodes[drug].published/nameNodes[drug].total;

					//Create links for trial sponsor --> drug
					if (!sourceLinks[sponsor]) sourceLinks[sponsor] = {};
					if (!sourceLinks[sponsor][drug]) {
						sourceLinks[sponsor][drug] = 1;
					}	else {
						sourceLinks[sponsor][drug] += 1;
					}
				}
			}

			// Set up nodes and links
			var trialsData = {
				"nodes": [],
				"links": []
			};
			// Put the object of keys into an array
			let k = 0;
			for (let key of Object.keys(nameNodes)) {
				trialsData.nodes[k] = nameNodes[key]
				trialsData.nodes[k].id = k;
				nameNodes[key].id = k;
				k += 1;
			}
			// set up{source: 0, target: 1, value: 0}
			let l = 0;
			for (var source of Object.keys(sourceLinks)) {
				for (var target of Object.keys(sourceLinks[source])) {
					trialsData.links[l] = {};
					trialsData.links[l].source = nameNodes[source].id;
					// trialsData.links[l].sourceName = source;
					trialsData.links[l].target = nameNodes[target].id;
					// trialsData.links[l].targetName = target;
					trialsData.links[l].value = sourceLinks[source][target];
					l += 1;
				}
			}
		}
		// console.log("nameNodes", nameNodes);
		// console.log("trialsData", trialsData);
		// console.log(sourceLinks);


		this.setState({
			data: trialsData
		})

		store.dispatch({
      type: GET_RELATIONSHIP_DATA,
			graphData: trialsData
    });

		return trialsData
	}

	render (props) {
			console.log("state: ",this.props);

  	return (

      <RelationshipsDiagram graphData={this.state.data}/>
    );
  }
}



const mapStateToProps = function(store) {
  return {
    // query: store.searchState.selectedQuery.query,
    searchHistory: store.searchState.searchHistory,
    // totalItems: store.searchState.currentResults,
    graph: store.scatterState.graphData,

  };
}
export default connect(mapStateToProps)(RelationshipsPage);
