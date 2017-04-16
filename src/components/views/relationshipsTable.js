import React, { Component } from 'react';
import _ from 'lodash'
import {Table, Column, Cell} from 'fixed-data-table-2';
// const Dimensions = require('react-dimensions');
//
// const rows = [
//   {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
//   {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
//   {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
//   {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
//   {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
//   {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
//   {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
//   {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]}
//   // .... and more organisations.name
// ];

const searchedItems = [
  // {
  //   date: "2013-09-01",
  //   drug: "citalopram; placebo; ",
  //   nctId: "NCT00898807",
  //   phase: "3",
  //   published: false,
  //   sponsor: "JHSPH Center for Clinical Trials",
  //   title: "Citalopram for Agitation in Alzheimer's Disease"
  // },
  {
    date: "",
    drug: "",
    nctId: "",
    phase: "",
    published: null,
    sponsor: "",
    title: ""
  }
];

export default class RelationshipsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedItems: searchedItems,
    }
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps, this.props)
  }

  componentWillUpdate(nextProps){
    // this.getSearchedItems(nextProps);
  }

  getSearchedItems(props) {

    let selected = props.nodes.filter((d) => {
      return d.name === props.selectedFilter;
    });
    const searchedItems =  selected[0][0].__data__.trials;

    return searchedItems;
  }

  render() {
    const {...props} = this.props;
    let searchedItems;
    if (this.props.selectedFilter) {
      searchedItems = this.getSearchedItems(this.props);

    } else {
      searchedItems = this.state.searchedItems;
    }
    const tableWidth = '100%';

    let textLength = []; let drugs = []; let titles = []; let trialIds = []; let publishedList = []; let organizations = []; let dates = []; let phaseList = [];

    //Trial Title
    for (let item of searchedItems) {
      let title = item.title;
      titles.push(title);
      title = '';
    }

    //Trial Interventions
    for (let item of searchedItems) {
      let drug = item.drug;
      drugs.push(drug);
      drug = '';
    }

    //Trial NCT IDs
    for (let item of searchedItems) {
      let id = item.nctId;
      trialIds.push(id);
      id = '';
    }

    //Trial Publication status
    for (let item of searchedItems) {
      let published = item.published;
      publishedList.push(published);
      published = '';
    }

    //Trial Phase
    for (let item of searchedItems) {
      let phase = item.phase;
      phaseList.push(phase);
      phase = '';
    }

    //Trial Organizations
    for (let item of searchedItems) {
      let os = item.sponsor
      if (os !== '') {
        organizations.push(os)
      } else {
        organizations.push("")
      }
    }

    // Date array
    let d;
    for (let item of searchedItems) {
      d = new Date(item.date)

      dates.push(d)
    }

    // Finding the longest thing the title, the list of conditions or the list of interventions --> dtmns row height
    let i = 0;
    for (let item of searchedItems) {
      textLength.push(item.title.length)
      if (item.id !== "") {
        if ((drugs[i].length >= item.title.length) && (drugs[i].length > 40)) {
          drugs[i] = (drugs[i].substring(0, (item.title.length - 20)) + "...");
        } else if ((organizations[i].length >= item.title.length) && (organizations[i].length > 40)) {
          organizations[i] = (organizations[i].substring(0, (item.title.length - 20)) + "...");
        }
      }
      i += 1;
    }

    return (
      <Table
         rowHeight={40}
         rowsCount={searchedItems.length}
         width={tableWidth}
         maxHeight={400}
         headerHeight={50}
         rowHeightGetter={(rowIndex) => Math.max(40, textLength[rowIndex]*1.1)}

         touchScrollEnabled={true}
         {...props}>
         <Column
           columnKey="Index Column"
           header={<Cell>  </Cell>}
           cell={({rowIndex, ...props}) => (
             <Cell {...props}>
              {rowIndex + 1}
             </Cell>
           )}
           width={40}

           fixed={true}
         />
         <Column
           columnKey="Title Column"
           header={<Cell>Title</Cell>}
           cell={({rowIndex, ...props}) => (
             <Cell {...props}>
                <a href={"https://explorer.opentrials.net/search?q=" + searchedItems[rowIndex].nctId} target={"_blank"}>
                  {titles[rowIndex]}
                </a>
             </Cell>
           )}
           width={300}
           // https://explorer.opentrials.net/search?q=NCT00002542

         />
         <Column
           columnKey="Drugs Column"
           header={<Cell>Drugs Tested</Cell>}
           cell={({rowIndex, ...props}) => (
             <Cell {...props}>
               {drugs[rowIndex]}
             </Cell>
           )}
           width={175}
          //  flexGrow={1}
         />
         <Column
           columnKey="Sponsor Column"
           header={<Cell>Lead Sponsor</Cell>}
           cell={({rowIndex, ...props}) => (
             <Cell {...props}>
               {organizations[rowIndex]}
             </Cell>
           )}
           width={225}
          //  flexGrow={1}
         />
         <Column
           columnKey="Publication Column"
           header={<Cell>Published?</Cell>}
           cell={({rowIndex, ...props}) => (
             <Cell {...props}>
              {(publishedList[rowIndex] === null ? '' : (publishedList[rowIndex] === true ? 'Yes' : 'No') )}
             </Cell>
           )}
           width={100}
          //  flexGrow={1}
         />
         <Column
           columnKey="Phase Column"
           header={<Cell>Trial Phase</Cell>}
           cell={({rowIndex, ...props}) => (
             <Cell {...props}>
              {phaseList[rowIndex]}
             </Cell>
           )}
           width={125}
          //  flexGrow={1}
         />
         <Column
           columnKey="Date Column"
           header={<Cell>Year</Cell>}
           cell={({rowIndex, ...props}) => (
             <Cell {...props}>
                {dates[rowIndex].getUTCFullYear()}
             </Cell>
           )}
           width={200}
          //  flexGrow={1}
         />
      </Table>
    ); // Closing return()
  } // Closing Render
} // Closing the Class



// Viewport Responsive
// See react-dimensions for the best way to configure
// https://github.com/digidem/react-dimensions
// http://schrodinger.github.io/fixed-data-table-2/example-responsive.html
// module.exports = Dimensions({
  // Uncomment the below out if you want the window size alone to dtmn the width
  // getHeight: function(element) {
  //   return window.innerHeight - 200;
  // },
  // getWidth: function(element) {
  //   var widthOffset = window.innerWidth < 680 ? 0 : 240;
  //   return window.innerWidth - widthOffset;
  // }
// })(RelationshipsTable);
