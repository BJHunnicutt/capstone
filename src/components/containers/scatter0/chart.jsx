// unfinished/src/components/chart.jsx
import React from 'react';
// import d3 from 'd3';
// import BarPlot from './bar-plot';
// Adding in redux
import { connect } from 'react-redux';
import SearchTable from '../../views/searchTable.js';

import store from '../../../store';   // Magic. FOR DISPATCH: You can just use this.props. instead of store. because of the <Provider> in src/index.js
import { GET_DATA_BAR } from '../../../actions/actions';
// import $ from 'jquery'
// import d3 from 'd3';

import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend} from 'recharts'; //CartesianGrid, ResponsiveContainer

// const data = [
//     {year: 2005, unpublished: 4000, published: 2400, amt: 2400},
//     {year: 2006, unpublished: 3000, published: 1398, amt: 2210},
//     {year: 2007, unpublished: 2000, published: 9800, amt: 2290},
//     {year: 2008, unpublished: 2780, published: 3908, amt: 2000},
//     {year: 2009, unpublished: 1890, published: 4800, amt: 2181},
//     {year: 2010, unpublished: 2390, published: 3800, amt: 2500},
//     {year: 2011, unpublished: 3490, published: 4300, amt: 2100},
// ];

//Width, height & padding

const styles = {
  // width  : 500,
  height : 400,
  // Only works when you fully reload the page
  width : (window.innerWidth >=  640 ? window.innerWidth/ 2.2 : window.innerWidth/1.1), // Testing out making the plot viewport responsive
  // height : 0.6 * window.innerWidth / 2,
  padding : 30,
  top: 25,
  right: 0, // Add padding here to see the x label
  bottom: 0,
  left: -35,
};

const randomNum = () => Math.floor(Math.random() * 100);

//Original data
var getDataset = () => {
  var dataRaw = [
      { year: 2005, unpublished: randomNum(), published: randomNum() },
      { year: 2006, unpublished: randomNum(), published: randomNum() },
      { year: 2007, unpublished: randomNum(), published: randomNum() },
      { year: 2008, unpublished: randomNum(), published: randomNum() },
      { year: 2009, unpublished: randomNum(), published: randomNum() }
  ]

  // // OMG THIS WORKS: copying data this way clones it so it doesnt mutate the original data
  // var newObject = $.extend(true, {}, dataRaw);
  //
  // // THIS MUTATES THE ORIGINAL ... if I copy the store, no matter how carefully I create the new copy, the original in the redux store is mutated when I use stack()
  // let newData = [];
  //
  // for (var i = 0, len = dataRaw.length; i < len; i++) {
  //   let set = dataRaw[i];
  //   let newSet = {};
  //   for (var key in set) {
  //     if (!(key in newSet)) {
  //       return newSet[key] = set[key];
  //     }
  //   }
  //   Object.assign({}, newData, {data: action.data})
  //   return newData[i] = newSet;
  // }

  // var stack = d3.layout.stack();
  // //Data, stacked
  // var dataset = stack(dataRaw);

  return dataRaw
};
// const data = getDataset();



class Chart extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      genderVisible: false,
      publicationVisible: true,
      buttonText: 'View Gender Distribution',
    };
    this.onClickSwap = this.onClickSwap.bind(this)
  }
  // This conditional showing method is based on this: http://stackoverflow.com/questions/29913387/show-hide-components-in-reactjs
  onClickSwap(event){  //THis is a custom method to allow events to update our state data
    this.setState({
      genderVisible: !this.state.genderVisible,
      publicationVisible: !this.state.publicationVisible,
      buttonText: this.state.buttonText === "View Gender Distribution" ? "View Publication Rates" : "View Gender Distribution"
    })
  }



  randomizeData() {
    // this.setState({ data: [] });
    this.props.dispatch({
      type: GET_DATA_BAR,
      data: getDataset(),
    });
  }



  render(props) {

    // Determine a title for
    let received = 0, total = 0;
    if (store.getState().searchState.selectedQuery.query !== "") {
      received = store.getState().searchState.searchHistory[store.getState().searchState.selectedQuery.query].items.length;
      total = store.getState().searchState.searchHistory[store.getState().searchState.selectedQuery.query].totalItems;
    }
    let searchTitle = '', searchTitle_bold = '';
    // TITLE: Before the first search
    if (store.getState().searchState.selectedQuery.query === "") {
      searchTitle = "Search for a Condition or Treatment to view results"
    // TITLE: during a search
    } else if (store.getState().searchState.searchHistory[store.getState().searchState.selectedQuery.query].isFetching === true) {
      searchTitle = "Fetching " + store.getState().searchState.searchHistory[store.getState().searchState.selectedQuery.query].totalItems + " Trials ... ";
      searchTitle_bold = (received/total*100).toPrecision(2) + "% complete"
    // TITLE: after a search is complete
    } else {
      searchTitle = total + " Trials found related to: ";
      searchTitle_bold = store.getState().searchState.selectedQuery.query;
    }
    // console.log(tooltipVisibility);
    // console.log(store.getState().searchState.selectedQuery.query);

    return (
      <div className='results-chart'>
        <h3 className="f2"> {searchTitle} <strong>{searchTitle_bold}</strong></h3>

        <div className="row search-result" >

          <div className="large-6 medium-6 small-12 columns">
              {/* Corresponding Results Table */}
              <div id="search-table-wrapper">
                <label>Individual Search Results</label>
                <SearchTable {...this.props}/>
              </div>
          </div>

          <div className="large-6 medium-6 small-12 columns">
              <div className="controls">
                <button className="button btn gender-btn" onClick={this.onClickSwap}>
                  {this.state.buttonText}
                </button>
              </div>
             {this.state.genderVisible ? (
               <div className="chart-wrapper">
                 <label>Targeted Gender of Searched Trials</label>
                 <GenderBarChart {...styles} />
               </div>
             ) : (null)}
             {this.state.publicationVisible ? (
             <div className="chart-wrapper">
               <label>Publication Status of Searched Trials</label>
               <PublicationBarChart {...styles} />
             </div>
             ) : (null)}

            {/* {publicationChart ? (
              <PublicationBarChart {...styles} {...this.props} />
            ) : (
              <GenderBarChart {...styles} {...this.props}/>
            )} */}


          </div>

        </div>

    </div>
    )
  }
};


// STATELESS FUNCTION COMPONENT
// const PublicationBarChart = (props) => {
class PublicationBarChart extends React.Component {
  render() {
  return (
    <BarChart width={styles.width} height={styles.height} data={store.getState().scatterState.dataBar}
          margin={{top: styles.top, right: styles.right, bottom: styles.bottom, left: styles.left}}>
       <XAxis dataKey="year" label='years'/>
       <YAxis label='trials'/>
       {/* <CartesianGrid strokeDasharray="3 3"/> */}
       <Tooltip isAnimationActive={false} animationDuration={50} animationEasing='ease' cursor={false}/>
       <Legend />
       <Bar dataKey="unpublished" animationDuration={100} stackId="a" fill="tomato" />
       <Bar dataKey="published" isAnimationActive={false} stackId="a" fill="yellowgreen" />
       <Bar dataKey="ongoing" isAnimationActive={false} stackId="a" fill="lightgray" />
    </BarChart>
  )}
}

// const GenderBarChart = (props) => {
class GenderBarChart extends React.Component {
  render() {
  return (
    <BarChart width={styles.width} height={styles.height} data={store.getState().scatterState.dataBar}
          margin={{top: styles.top, right: styles.right, bottom: styles.bottom, left: styles.left}}>
       <XAxis dataKey="year" label='years'/>
       <YAxis label='trials'/>
       {/* <CartesianGrid strokeDasharray="3 3"/> */}
       <Tooltip isAnimationActive={false} animationDuration={50} animationEasing='ease' cursor={false} />
       <Legend />
       <Bar dataKey="female" animationDuration={100} stackId="a" fill="gold" />
       <Bar dataKey="both" animationDuration={100} stackId="a" fill="yellowgreen" />
       <Bar dataKey="male" isAnimationActive={false} stackId="a" fill="darkcyan" />
       <Bar dataKey="na" isAnimationActive={false} stackId="a" fill="lightgray" />
    </BarChart>
  )}
}


// class ConditionalTooltip extends React.Component {
//   render(){
//     // console.log("vis", this.props.visible);
//     // const visible = this.props.visible;
//     // if (visible) {
//       return <Tooltip isAnimationActive={false} animationDuration={50} animationEasing='ease' cursor={false}/>;
//     // }
//     // return null;
//   }
// }

const mapStateToProps = function(store) {
  return {
    data: store.scatterState.dataBar,
    showPublications: store.scatterState.showPublications,
    query: store.searchState.selectedQuery.query,
    items: store.searchState.searchedTrials.items,
    searchHistory: store.searchState.searchHistory,
    totalItems: store.searchState.currentResults,
  };
}

export default connect(mapStateToProps)(Chart);
