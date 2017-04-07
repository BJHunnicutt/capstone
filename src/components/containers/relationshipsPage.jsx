import React from 'react';
// import store from '../../store';
import { connect } from 'react-redux';
import '../../styles/relationships.css';
import d3 from 'd3'
import allData from '../data/SSRI_filtered.csv'
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
			// This store data is set with setUpRelationships in componentWillMount
      data: store.getState().scatterState.graphData,
    }
  }

	componentWillMount() {
		// console.log("componentWillMount");
		d3.csv(allData, (data) => {
			// console.log('d3csv: ', data);
			this.setUpRelationships(data);
		});
	}

	componentDidMount() {
		// console.log('did mount');
	}

	setUpRelationships(data) {
		// the commented ones are all listed antidepressants that didn't have any relults, maybe add back later
		const SSRIs = {
			citalopram: { name: 'citalopram', brandName: 'Celexa', type: 'SSRI' },
			escitalopram: { name: 'escitalopram', brandName: 'Lexapro, Cipralex', type: 'SSRI' },
			paroxetine: { name: 'paroxetine', brandName: 'Paxil, Seroxat', type: 'SSRI' },
			fluoxetine: { name: 'fluoxetine', brandName: 'Prozac', type: 'SSRI' },
			fluvoxamine: { name: 'fluvoxamine', brandName: 'Luvox', type: 'SSRI' },
			sertraline: { name: 'sertraline', brandName: 'Zoloft, Lustral', type: 'SSRI' },
			desvenlafaxine: { name: 'desvenlafaxine', brandName: 'Pristiq', type: 'SNRI' },
			duloxetine: { name: 'duloxetine', brandName: 'Cymbalta', type: 'SNRI' },
			// levomilnacipran: { name: 'levomilnacipran', brandName: 'Fetzima', type: 'SNRI' },
			milnacipran: { name: 'milnacipran', brandName: 'Ixel, Savella', type: 'SNRI' },
			// tofenacin: { name: 'tofenacin', brandName: 'Elamol, Tofacine', type: 'SNRI' },
			venlafaxine: { name: 'venlafaxine', brandName: 'Effexor', type: 'SNRI' },
			vilazodone: { name: 'vilazodone', brandName: 'Viibryd', type: 'SMS' },
			vortioxetine: { name: 'vortioxetine', brandName: 'Trintellix', type: 'SMS' },
			// etoperidone: { name: 'etoperidone', brandName: 'Axiomin, Etonin', type: 'SARI' },
			trazodone: { name: 'trazodone', brandName: 'Desyrel', type: 'SARI' },
			reboxetine: { name: 'reboxetine', brandName: 'Edronax', type: 'NRI' },
			// viloxazine: { name: 'viloxazine', brandName: 'Vivalan', type: 'NRI' },
			bupropion: { name: 'bupropion', brandName: 'Wellbutrin', type: 'NRI' },
			// teniloxazine: { name: 'teniloxazine', brandName: 'Lucelan, Metatone', type: 'NRI' },
			amitriptyline: { name: 'amitriptyline', brandName: 'Elavil, Endep', type: 'TCA' },
			// amitriptylinoxide: { name: 'amitriptylinoxide', brandName: 'Amioxid, Ambivalon, Equilibrin', type: 'TCA' },
			clomipramine: { name: 'clomipramine', brandName: 'Anafranil', type: 'TCA' },
			desipramine: { name: 'desipramine', brandName: 'Norpramin, Pertofrane', type: 'TCA' },
			// dibenzepin: { name: 'dibenzepin', brandName: 'Noveril, Victoril', type: 'TCA' },
			// dimetacrine: { name: 'dimetacrine', brandName: 'Istonil', type: 'TCA' },
			// dosulepin: { name: 'dosulepin', brandName: 'Prothiaden', type: 'TCA' },
			doxepin: { name: 'doxepin', brandName: 'Adapin, Sinequan', type: 'TCA' },
			imipramine: { name: 'imipramine', brandName: 'Tofranil', type: 'TCA' },
			// lofepramine: { name: 'lofepramine', brandName: 'Lomont, Gamanil', type: 'TCA' },
			// melitracen: { name: 'melitracen', brandName: 'Dixeran, Melixeran, Trausabun', type: 'TCA' },
			// nitroxazepine: { name: 'nitroxazepine', brandName: 'Sintamil', type: 'TCA' },
			nortriptyline: { name: 'nortriptyline', brandName: 'Pamelor, Aventyl', type: 'TCA' },
			// noxiptiline: { name: 'noxiptiline', brandName: 'Agedal, Elronon, Nogedal', type: 'TCA' },
			// pipofezine: { name: 'pipofezine', brandName: 'Azafen/Azaphen', type: 'TCA' },
			protriptyline: { name: 'protriptyline', brandName: 'Vivactil', type: 'TCA' },
			// trimipramine: { name: 'trimipramine', brandName: 'Surmontil', type: 'TCA' },
			// amoxapine: { name: 'amoxapine', brandName: 'Asendin', type: 'TeCA' },
			// maprotiline: { name: 'maprotiline', brandName: 'Ludiomil', type: 'TeCA' },
			// mianserin: { name: 'mianserin', brandName: 'Bolvidon, Norval, Tolvon', type: 'TeCA' },
			mirtazapine: { name: 'mirtazapine', brandName: 'Remeron', type: 'TeCA' },
			// setiptiline: { name: 'setiptiline', brandName: 'Tecipul', type: 'TeCA' },
			// isocarboxazid: { name: 'isocarboxazid', brandName: 'Marplan', type: 'MAOI' },
			// phenelzine: { name: 'phenelzine', brandName: 'Nardil', type: 'MAOI' },
			// tranylcypromine: { name: 'tranylcypromine', brandName: 'Parnate', type: 'MAOI' },
			selegiline: { name: 'selegiline', brandName: 'Eldepryl, Zelapar, Emsam', type: 'MAOI' },
			// metralindole: { name: 'metralindole', brandName: 'Inkazan', type: 'MAOI' },
			moclobemide: { name: 'moclobemide', brandName: 'Aurorix, Manerix', type: 'MAOI' },
			// pirlindole: { name: 'pirlindole', brandName: 'Pirazidol', type: 'MAOI' },
			// toloxatone: { name: 'toloxatone', brandName: 'Humoryl', type: 'MAOI' }
		};

		let nameNodes = {}
		let baseNode = {name: '', group: 0, type: '', published: 0, total: 0, fraction_published: 0}
		let sourceLinks = {}
		// let allLinks = 0;

		for (var i = 0; i < data.length; i++) {
			// If this is a drug study
			if (data[i].has_drug_intervention === "True") {
				// There can be multiple drugs separated by semicolons, this separates them into an array
				let drugs = (data[i].drugs).split(/;/).filter(function(n){ return n !== " " });
				let sponsor = (data[i].lead_sponsor).trim(); //.toLowerCase();

				// Set up base values for Sponsors
				if (!nameNodes[sponsor]) {
					nameNodes[sponsor] = $.extend(true, {}, baseNode);
					nameNodes[sponsor].name = sponsor;
					nameNodes[sponsor].allNames = sponsor; // THis is a lazy way of dealing with displaying multiple drug names sometimes
					nameNodes[sponsor].group = 2;
					nameNodes[sponsor].type = 'sponsor';
					nameNodes[sponsor].trials = [{
							nctId: data[i].nct_id,
							sponsor: sponsor,
							drug: data[i].drugs,
							published: !data[i].is_overdue,
							title: data[i].title,
							phase: data[i].phase_normalised,
							date: data[i].completion_date
					}];
				} else {
					nameNodes[sponsor].trials.push({
							nctId: data[i].nct_id,
							sponsor: sponsor,
							drug: data[i].drugs,
							published: !data[i].is_overdue,
							title: data[i].title,
							phase: data[i].phase_normalised,
							date: data[i].completion_date
					});
				}
				// Increment values for new and old sponsors
				if (data[i].is_overdue === "False") nameNodes[sponsor].published +=1;
				nameNodes[sponsor].total += 1;
				nameNodes[sponsor].fraction_published = nameNodes[sponsor].published/nameNodes[sponsor].total;

				for (let el of drugs) {
					let drug = el.trim().toLowerCase();
					// Don't include placebo
					if ( drug.includes('placebo') ) { continue; }

					// This is a bad idea, it only adds 23 more links (484-> 507) but it is
					//   mostly picking up drug combinations (plus it also aberrantly groups
					//   escitalopram with citalopram)
					// let inList = _.find(SSRIs, (a) => drug.includes(a.name))
					// if (inList === undefined) { continue; } else {drug = inList.name; }

					// Skip if the drug is not in the list
					if ( !SSRIs[drug] ) { continue; }

					// Set up base values for Drugs
					if (!nameNodes[drug]) {
						nameNodes[drug] = $.extend(true, {}, baseNode);
						nameNodes[drug].name = drug;
						nameNodes[drug].group = 1;
						nameNodes[drug].type = 'drug';
						// Add the brand name to the node info
						nameNodes[drug].brandName = SSRIs[drug].brandName;
						nameNodes[drug].actionType = SSRIs[drug].type;
						nameNodes[drug].allNames = `${drug} (${SSRIs[drug].brandName})`;
						nameNodes[drug].trials = [{
								nctId: data[i].nct_id,
								sponsor: sponsor,
								drug: data[i].drugs,
								published: !data[i].is_overdue,
								title: data[i].title,
								phase: data[i].phase_normalised,
								date: data[i].completion_date
						}];
					} else {
						nameNodes[drug].trials.push({
								nctId: data[i].nct_id,
								sponsor: sponsor,
								drug: data[i].drugs,
								published: !data[i].is_overdue,
								title: data[i].title,
								phase: data[i].phase_normalised,
								date: data[i].completion_date
						});
					}
					// Increment values for new and old
					if (data[i].is_overdue === "False") nameNodes[drug].published +=1;
					nameNodes[drug].total += 1;
					nameNodes[drug].fraction_published = nameNodes[drug].published/nameNodes[drug].total;

					//Create links for trial sponsor --> drug
					if (!sourceLinks[sponsor]) sourceLinks[sponsor] = {};
					if (!sourceLinks[sponsor][drug]) {
						sourceLinks[sponsor][drug] = 1;
						// allLinks += 1;
					}	else {
						sourceLinks[sponsor][drug] += 1;
						// allLinks += 1;
					}
				}
			}

			// Set up nodes and links
			var trialsData = {
				"nodes": [],
				"links": []
			};
			// Put the keys (i.e. drugs) into an array
			let k = 0;
			for (let key of Object.keys(nameNodes)) {
				trialsData.nodes[k] = nameNodes[key]
				trialsData.nodes[k].id = k;
				// Add an id to the original data that corresponds to the array index for trialsData.nodes[i]
				nameNodes[key].id = k;
				k += 1;
			}
			// set up{source: 0, target: 1, value: 0}
			let l = 0;
			// Put the keys (i.e. sponsors) into an array
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

		// const antideps = _.filter(nameNodes, (node) => node.group === 1);
		// for ( let node of antideps) {
		// 	console.log(node.name + '(' + node.actionType + ')');
		// }
		// console.log(antideps.length);
		// console.log('allLinks', allLinks);
		// console.log("nameNodes", nameNodes);
		console.log("trialsData", trialsData);
		// console.log("sourceLinks", sourceLinks);


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
			// console.log("state: ",this.props);

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
