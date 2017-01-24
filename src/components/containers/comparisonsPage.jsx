import React from 'react';
import '../../styles/comparisons.css';
import store from '../../store';
import { connect } from 'react-redux';

import ComparisonChart from '../views/comparisonChart.jsx'
import $ from 'jquery'
import _ from 'lodash'

const randomNum = () => Math.floor(Math.random() * 100);
const getYear = (years) => {
  var rand = years[Math.floor(Math.random() * years.length)];
  return rand;
}

class ComparisonsPage extends React.Component {
  constructor(props){
    // console.log(props);
    super(); // "To get our context"
    let queries = Object.keys(store.getState().searchState.searchHistory);
    let year = 2013;
    this.state = {
      queries: queries,
      data: this.getData(queries, year),
      allData: store.getState().searchState.searchHistory,
      year: year,
      allYears: this.getYears(queries),
      startYear: this.getFirstYear(queries),
      endYear: this.getLastYear(queries),
      maxHeight: this.getHeight(queries),
      maxPieSize: this.getPieSize(queries)
    }
  }

  handleChange(e) {
    // console.log("pos: ", pos.target.value)

    this.setState({
      year: parseInt(e.target.value, 10)
    });
  }

  renderCharts() {

    return (props) => {
      // console.log('renderCharts num: ', props);

      // console.log('years: ',this.state.allYears);
      let lineData = this.getLineData(props.query);
      let pieData = this.getPieData(props.query);

      // console.log('return num: ', props);
      const chartProps = {
        key: props.query
      };
      return <ComparisonChart {...chartProps} {...props} {...this.state} lineData={lineData} pieData={pieData}/>
    }
  }

  getData(queries, year) {
    let dataArray = [];
    queries.map((query, i) => {
      // console.log('query: ',i );
      dataArray[i] = store.getState().searchState.searchHistory[query].cumulativeSummary[year]
    });

    // let dataArray = [
    //   {num: 1, radius: randomNum(), year: getYear([2012, 2013, 2014])},
    //   {num: 2, radius: randomNum(), year: getYear([2012, 2013, 2014])},
    //   {num: 3, radius: randomNum(), year: getYear([2012, 2013, 2014])}
    // ];
    return dataArray;
  }

  getYears(queries){
    let yearsInDataset = _.range(this.getFirstYear(queries), this.getLastYear(queries));
    return yearsInDataset; //An array of years
  }

  getFirstYear(queries) {
    let startYear = 2017;
    for (let query of queries) {
      let summary = $.extend(true, {}, store.getState().searchState.searchHistory[query].cumulativeSummary);
      let allYears = Object.keys(summary);
      let first = Math.min(...allYears);
      first < startYear ? startYear = first : startYear = startYear;
    }
    return startYear
  }

  getLastYear(queries) {
    let endYear = 0;
    for (let query of queries) {
      let summary = $.extend(true, {}, store.getState().searchState.searchHistory[query].cumulativeSummary);
      let allYears = Object.keys(summary);
      let last = Math.max(...allYears);
      last > endYear ? endYear = last : endYear = endYear;
    }
    return endYear
  }

  getHeight(queries) {
    let maxHeight = 0;
    for (let query of queries) {
      let line = this.getLineData(query);
      let queryHeight = line[line.length-1].total;
      queryHeight > maxHeight ? maxHeight = queryHeight : maxHeight = maxHeight;
      // console.log('max', query, queryHeight);
    }
    return maxHeight;
  }

  getLineData(query) {
    let summary = $.extend(true, {}, store.getState().searchState.searchHistory[query].cumulativeSummary);
    // let allYears = Object.keys(summary);
    let queries = Object.keys(store.getState().searchState.searchHistory);
    let allYears = this.getYears(queries);
    let lineData = [];
    let pubs = ['published', 'unpublished', 'ongoing'];

    for (let i = 0; i < allYears.length; i++) {
      let year = parseInt(allYears[i], 10);
      lineData[i] = {};
      lineData[i].year = year;
      for (let pub of pubs) {
        if (summary[year]) {
          lineData[i][pub] = summary[year][pub].total.trials
          lineData[i][pub + "_size"] = summary[year][pub].total.participants;
        } else {
          lineData[i][pub] = 0;
          lineData[i][pub + "_size"] = 0;
        }
      }
      if (summary[year]) {
        lineData[i].total = summary[year].published.total.trials + summary[year].unpublished.total.trials + summary[year].ongoing.total.trials;
        lineData[i].total_size = summary[year].published.total.participants + summary[year].unpublished.total.participants + summary[year].ongoing.total.participants;
        lineData[i].y = -0.001;
      } else {
        lineData[i].total = 0;
        lineData[i].y = -0.001;
      }
    }

    // console.log('linedata: ',lineData);
    return lineData;
    // [
    //   {year: 2012, pub: 1, unpub: 0, ongoing: 2, pub_size: 7483, unpub_size: 1483},
    //   {year: 2013, profit: 2},
    //   {year: 2014, profit: 2}
    // ]
  }

  getPieData(query) {
    let summary = $.extend(true, {}, store.getState().searchState.searchHistory[query].cumulativeSummary);
    // let lineData = this.getLineData(query);
    // let allYears = Object.keys(summary);
    let queries = Object.keys(store.getState().searchState.searchHistory);
    let allYears = this.getYears(queries);

    let pieData = {};
    for (let i = 0; i < allYears.length; i++) {
      let year = parseInt(allYears[i], 10);
      pieData[year] = {};
      let maxTrials = 0;
      let maxSize = 0;

      let gens = ['female', 'both', 'male', 'na'];
      let pubs = ['published', 'unpublished', 'ongoing'];
      pieData[year].status = []
      let p = 0;
      for (let pub of pubs) {
        pieData[year][pub] = [];
        //Loop through genders
        for (let g = 0; g < gens.length; g++) {
          let gen = gens[g];
          if (summary[year]) {
            pieData[year][pub][g] = {gender: gen, trials: summary[year][pub][gen].trials, size: summary[year][pub][gen].participants};
          } else {
            pieData[year][pub][g] = {gender: gen, trials: 0, size: 0};
          }
        }
        if (summary[year]) {
          pieData[year].status[p] = {status: pub, trials: summary[year][pub].total.trials, size: summary[year][pub].total.trials}
          summary[year][pub].total.trials > maxTrials ? (maxTrials = summary[year][pub].total.trials) : (maxTrials = maxTrials)
          summary[year][pub].total.participants > maxSize ? (maxSize = summary[year][pub].total.participants) : (maxSize = maxSize)
        } else {
          pieData[year].status[p] = {status: pub, trials: 0, size: 0}
        }
        p += 1;
      }

      pieData[year].maxTrials = maxTrials;
      pieData[year].maxSize = maxSize;
      pieData.lastYear = year;

    }

    // console.log('piedata: ', pieData);
    return pieData;
  }

  getPieSize(queries) {
    let maxPieSize = 0;
    for (let query of queries) {
      let pie = this.getPieData(query);
      let querySize = pie[pie.lastYear].maxTrials;
      querySize > maxPieSize ? maxPieSize = querySize : maxPieSize = maxPieSize;
      // console.log('max', query, queryHeight);
    }
    return maxPieSize;
  }



    // console.log('piedata: ', pieData);
    // return null; //pieData;
    // Example
    // let pieDataSample = {
    //   2012: {
    //     published: [
    //         {gender: "female", trials: 0, size: 0},
    //         {gender: "both", trials: 0, size: 0},
    //         {gender: "female", trials: 0, size: 0},
    //         {gender: "na", trials: 0, size: 0}
    //     ],
    //     unpublished: [
    //         {gender: "female", trials: 33, size: 33},
    //         {gender: "both", trials: 33, size: 33},
    //         {gender: "female", trials: 33, size: 33},
    //         {gender: "na", trials: 33, size: 33}
    //     ],
    //     ongoing: [
    //         {gender: "female", trials: 33, size: 33},
    //         {gender: "both", trials: 33, size: 33},
    //         {gender: "female", trials: 33, size: 33},
    //         {gender: "na", trials: 33, size: 33}
    //     ],
    //     status:[
    //         {status: "published", trials: 33, size: 33},
    //         {status: "unpublished", trials: 33, size: 33},
    //         {status: "ongoing", trials: 33, size: 33},
    //     ],
    //     max_trials: 33, //because I want to normalize to the max of any group (pub, unpub, ongoing) in any year
    //   },
    //   2013: {} };


  toggleData() {
    // console.log('click');
    this.setState({
      year: getYear(this.state.allYears),
    });
  }

	render (props) {


  	return (
      <g>
        <div className='comparisons-wrapper row'>
          <div className="large-12 medium-12 small-12 columns">

            { this.state.data.map(this.renderCharts(props)) }

          </div>
        </div>

        <div className='slider-wrapper row'>
          <div className="comparison-panel large-3 medium-3 small-8 end columns">
            <input
              id="typeinp"
              type="range"
              min={this.state.startYear} max={this.state.endYear-1}
              value={this.state.year}
              onChange={this.handleChange.bind(this)}
              step="1"/>

            {/* <ReactBootstrapSlider
              value={this.state.year}
              // change={this.handleChange.bind(this)}
              slideStop={this.handleChange.bind(this)}
              step={1}
              ticks = {this.state.allYears}
              tooltip={'hide'}
              max={this.state.endYear}
              min={this.state.startYear}
              // orientation="horizontal"
              reverse={true}
              disabled="enabled"
            /> */}
          </div>
        </div>

        {/* <h6>{this.store.year}</h6> */}
        <button className="button" onClick={this.toggleData.bind(this)}>Swap the year!</button>
      </g>

    );
  }
}



// const renderCircles = (props) => {
//   return (coords, index) => { //coords are being passed as props below in .map(renderCircles(props))
//     const circleProps = {
//       cx: props.xScale(coords[0]),
//       cy: props.yScale(coords[1]),
//       r: 2,
//       key: index
//     };
//     return <Circle {...circleProps} />;
//   };
// };
//
// export default (props) => {
//   return <g>{ props.data.map(renderCircles(props)) }</g>
// }


const mapStateToProps = function(store) {
  return {
    query: store.searchState.selectedQuery.query,
    searchHistory: store.searchState.searchHistory,
    totalItems: store.searchState.currentResults,
    data: store.scatterState.dataBar,

  };
}
export default connect(mapStateToProps)(ComparisonsPage);
