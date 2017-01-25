import React from 'react';
import store from '../../store';
import $ from 'jquery'
import _ from 'lodash'
import { SELECT_SEARCH, GET_RESULTS, GET_DATA_BAR } from '../../actions/actions'; //FAILED_SEARCH,
import {browserHistory} from 'react-router';


// NOTE: summarizeSearch() is a helper method, main class at the bottom (just moved this up here to get rid of a linter warning)

let getYear = (date) => {
  let d = new Date(date);
  return d.getFullYear();
}

let summarizeSearch = () => {

  if (store.getState().searchState.selectedQuery.totalItems !== 0) {
    // Immutably copy the search results
    var newObject = $.extend(true, {}, store.getState().searchState.currentResults.items);
    // var newObject = store.getState().searchState.currentResults.items;  // DOOOON'T do it
    // newObject.test = 'banana';


    // loop through the search results and get the total trials for each gender
    let sumData={};

    for (let trial in newObject) {
      if (true) {

        let year = getYear(newObject[trial].registration_date);
        if (!sumData[year]) {
          sumData[year] = {}
        }
        let attr = 'total';
        sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
        if (newObject[trial].gender === 'female') {
          let attr = 'female';
          sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
        } else if (newObject[trial].gender === 'male') {
          let attr = 'male';
          sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
        } else if (newObject[trial].gender === 'both') {
          let attr = 'both';
          sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
        } else if (newObject[trial].gender === undefined) {
          let attr = 'na';
          sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
        } else {
          console.log('failure to identify gender of '+ newObject[trial].id +' in searchPage summarizeSearch()');
        }
      }
    }

    // loop through the search results and get the total trials published/unpublished
    for (let trial in newObject) {
      if (true) {
        let year = getYear(newObject[trial].registration_date);
        if (!sumData[year]) {
          sumData[year] = {}
        }
        if (newObject[trial].has_published_results === true) {
          let attr = 'published';
          sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
        } else if ((newObject[trial].status === 'ongoing') ) { //&& (parseInt(year, 10) > 2013)
          let attr = 'ongoing';
          sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
        } else if (newObject[trial].has_published_results === false) {
          let attr = 'unpublished';
          sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
        } else if (newObject[trial].publications.length === 0) {
          let attr = 'unpublished';
          sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
        } else if (newObject[trial].publications.length > 0) {
          let attr = 'published';
          sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
        } else {
          console.log('failure to identify publication status of '+ newObject[trial].id +' in searchPage summarizeSearch()');
        }
      }
    }

    // console.log("sumData: ", sumData);

    let summaryData = []
      // {year: 2006, unpublished: 0, published: 0, male: 0, female: 0, both: 0, na: 0},
    // ]
    let currentYear = new Date();
    currentYear = getYear(currentYear);
    let firstTrialYear = parseInt(Object.keys(sumData)[0], 10);
    let yearsInDataset = _.range(firstTrialYear, currentYear + 1);
    let attrs = ['unpublished', 'published', 'ongoing', 'male', 'female','both', 'na', 'total']

    for (var i = 0; i < yearsInDataset.length; i++) {
        let year = yearsInDataset[i];
        let yearData = {};
        yearData.year = year;
        for (let attr of attrs) {
          if (sumData[year]) {
            sumData[year][attr] ? (yearData[attr] = sumData[year][attr]) : (yearData[attr] = 0);
          } else {
            yearData[attr] = 0;
          }
        }
        summaryData[i] = yearData;
    }
    // console.log("summaryData: ", summaryData);
    store.dispatch({
      type: GET_DATA_BAR,
      data: summaryData,
    });

  } // closing if there was a search query
} // closing summarizeSearch()



const renderHistory = (props, updateDisplay) => {

  return (query) => { //searches are being passed as props below in .map(renderHistory(props)) * i.e. the keys of the history object
    const historyProps = {
      key: query
    };
    // // return <Circle {...circleProps} />;
    // let cleanSearch = search.replace(/[^a-zA-Z ]/, "");
    // let validSearch = cleanSearch !== '';

    return (
      // <li {...historyProps}>
          <button className="button search-history-btn" {...historyProps} onClick={() => updateDisplay(query)}>
            {query}
          </button>

      // </li>
    )
  };
};

const getTitle = (props) => {
  if (props.location.pathname === '/capstone/search/') {
    return "Recent Searches (click to view)";
  } else {
    return "Recent Searches";
  }
}


export default (props) => {
    let updateDisplay = (query) => {

      // dispatch() SELECT_SEARCH & GET_RESULTS & GET_DATA_BAR
      // Update all the store components related to current search (summarizeSearch() calls GET_DATA_BAR)
      store.dispatch({
        type: SELECT_SEARCH,
        query: query,
        totalItems: props.searchHistory[query].totalItems,
      });

      let ids = store.getState().searchState.searchHistory[query].items;
      let trials = store.getState().searchState.searchedTrials.items;
      store.dispatch({
        type: GET_RESULTS,
        query: query,
        ids: ids,
        trials: trials
      });
      summarizeSearch();

      // Redirect to the Search page if they click on the homepage
      if (props.location.pathname === '/capstone/') {
        browserHistory.push('/capstone/search/');
        console.log(props.location.pathname)
      }


    }

    let searched = (store.getState().searchState.selectedQuery.query !== '')

    return (
      <div className='search-results'>
        {searched ? (
          <div>
            <label> {getTitle(props)} </label>
            <g className="recent-searches-group">
              { Object.keys(props.searchHistory).map(renderHistory(props, updateDisplay)) }
            </g>
            <button className='button clear-history-btn' onClick={props.clearSearches}>clear search history</button>
          </div>
        ) : (null)}
      </div>
    )
}
